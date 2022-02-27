let username = document.querySelector("#username");
let id = document.querySelector("#userid");
let socket = io();

const textarea = document.querySelector("#textarea");
const imagecall = document.querySelector("#imagecall");
const commentBox = document.querySelector("#comment__box");
const userchatbox = document.querySelector("#userchatbox");
const recievername = document.querySelector("#recievername");
const recieverid = document.querySelector("#recieverid");
const typebox = document.querySelector("#typing");
const uploadfile = document.querySelector("#uploadfile");
const userlistdiv = document.querySelector("#userlist");

var element = document.querySelector("#chat-history-data");

userchatbox.style.display = "none";

imagecall.addEventListener("click", function () {
  document.querySelector("#uploadfile").click();
});

// $("#textarea").emojioneArea({
//   pickerposition: "top",
// });

uploadfile.addEventListener("change", function (e) {
  var data = uploadfile.files[0];
  readThenSendFile(data);
});

function userlist(user) {
  let lTag = document.createElement("li");
  lTag.classList.add("comment", "clearfix");
  let userdata = ` <li class="clearfix">
    <img src="https://bootdey.com/img/Content/avatar/avatar1.png" alt="avatar">
    <div class="about" onclick="getchatbox('${user.id}','${user.name}')">
        <div class="name">
            ${user.name}
        </div>
        <h6 id="typingbox${user.id}" style="color: green;"></h6>
        <div class="status"> <i class="fa fa-circle online"></i>${daysDiff(
          user.datetime
        )}</div>
    </div>
</li>`;

  lTag.innerHTML = userdata;
  userlistdiv.append(lTag);
}

function readThenSendFile(filedata) {
  var reader = new FileReader();
  reader.onload = function (evt) {
    let data = {
      id: id.value,
      username: username.value,
      comment: evt.target.result,
      file_name: filedata.name,
      recievid: recieverid.value,
    };
    syncWithDb(data);
    socket.emit("base64 file", data);
  };
  reader.readAsDataURL(filedata);
}

socket.on("base64 file", (data) => {
  if (data.id == recieverid.value && id.value == data.recievid) {
    appendToDom2(data);
  }

  if (id.value == data.recievid) {
    usernewlis(data);
  }
});

function enterKeyPressed(event) {
  console.log(event);
  if (event.keyCode == 13) {
    let comment = $("#textarea").val();
    if (!comment) {
      return;
    }
    $(".emojionearea-editor").empty();
    $("#textarea").val("");
    postComment(comment);
  }
}

function postComment(comment) {
  // Append to dom
  let data = {
    id: id.value,
    username: username.value,
    comment: comment,
    recievid: recieverid.value,
  };

  // Broadcast
  broadcastComment(data);
  // Sync with Mongo Db
  syncWithDb(data);
}

function getchatbox(userid, name) {
  userchatbox.style.display = "block";
  recievername.innerHTML = "";
  recievername.append(name);
  recieverid.value = userid;
  commentBox.innerHTML = "";
  fetchComments();
}

async function appendToDom(data) {
  let lTag = document.createElement("li");
  lTag.classList.add("comment", "mb-3");
  let markup = `
<li class="clearfix">

<div class="message other-message float-right">`;
  let style = `style=" height: 461px; width: 594px;"`;

  if ("file_name" in data && data.file_name != "") {
    if (data.file_name.indexOf("pdf") > 0) {
      markup += `<a href="${data.comment}" download="${data.file_name}">
        <object data="${data.comment}" data="" type="application/pdf" ${style}></object></a>`;
    } else if (
      data.file_name.indexOf("doc") > 0 ||
      data.file_name.indexOf("docx") > 0
    ) {
      markup += `<a href="${data.comment}" download="${data.file_name}"><object data="${data.comment}" type="application/msword" ${style}></object>`;
    } else if (
      data.file_name.indexOf("jpg") > 0 ||
      data.file_name.indexOf("png") > 0
    ) {
      markup += `<img src="${data.comment}" ${style}>`;
    } else {
      markup += `<video ${style} controls>
        <source src="${data.comment}" type="video/mp4">
        <source src="${data.comment}" type="video/ogg">
      Your browser does not support the video tag.
      </video>`;
    }
  } else {
    markup += `${data.comment}`;
  }
  markup += `</div>
<br>
<br>
<br>
<span class="message-data-time float-right">${moment(data.time).format(
    "LT"
  )}</span>
</li>                    
    `;
  lTag.innerHTML = markup;
  await commentBox.append(lTag);
}

async function broadcastComment(data) {
  // Socket

  // await fetchComments();
  await usernewlis(data);
  socket.emit("comment", data);
}

async function appendToDom2(data) {
  let lTag = document.createElement("li");
  lTag.classList.add("comment", "mb-3");
  let style = `style=" height: 461px; width: 594px;"`;
  let markup = `<li class="clearfix">
                            <div class="message my-message">`;
  if ("file_name" in data && data.file_name != "") {
    if (data.file_name.indexOf("pdf") > 0) {
      markup += `<a href="${data.comment}" download="${data.file_name}">
                                    <object data="${data.comment}" data="" type="application/pdf" ${style}></object></a>`;
    } else if (
      data.file_name.indexOf("doc") > 0 ||
      data.file_name.indexOf("docx") > 0
    ) {
      markup += `<a href="${data.comment}" download="${data.file_name}"><object data="${data.comment}" type="application/msword" ${style}></object>`;
    } else if (
      data.file_name.indexOf("jpg") > 0 ||
      data.file_name.indexOf("png") > 0
    ) {
      markup += `<img src="${data.comment}" ${style}>`;
    } else {
      markup += `<video ${style} controls>
                                    <source src="${data.comment}" type="video/mp4">
                                    <source src="${data.comment}" type="video/ogg">
                                  Your browser does not support the video tag.
                                  </video>`;
    }
  } else {
    markup += `${data.comment}`;
  }

  markup += `</div><br>
                            <span class="message-data-time">${moment(
                              data.time
                            ).format("LT")}</span>
                        </li>
                        `;
  lTag.innerHTML = markup;

  await commentBox.append(lTag);
}

socket.on("comment", (data) => {
  if (data.id == recieverid.value && id.value == data.recievid) {
    fetchComments();
  }

  if (id.value == data.recievid) {
    usernewlis(data);
  }
});
let timerId = null;
function debounce(func, timer) {
  if (timerId) {
    clearTimeout(timerId);
  }
  timerId = setTimeout(() => {
    func();
  }, timer);
}
let typingDiv = document.querySelector(".typing");

socket.on("typing", (data) => {
  const typingbox = document.querySelector("#typingbox" + data.id);
  if (data.id == recieverid.value && id.value == data.recievid) {
    typebox.innerText = `typing...`;
  }
  if (id.value == data.recievid) {
    typingbox.innerText = `typing...`;
  }

  debounce(function () {
    typebox.innerText = "";
    typingbox.innerText = "";
  }, 1000);
});

// Event listner on textarea
textarea.addEventListener("keyup", (e) => {
  let comment = textarea.value;
  let data = {
    id: id.value,
    username: username.value,
    comment: comment,
    recievid: recieverid.value,
  };
  socket.emit("typing", data);
});

// Api calls

function syncWithDb(data) {
  const headers = {
    "Content-Type": "application/json",
  };
  fetch("/postcomment", { method: "POST", body: JSON.stringify(data), headers })
    .then((response) => response.json())
    .then((result) => {
      appendToDom(data);
    });
}

function usernewlis() {
  let body = {
    senderid: id.value,
    recievid: "",
  };
  const headers = {
    "Content-Type": "application/json",
  };
  fetch("/getuserlistbylastcomment", {
    method: "POST",
    body: JSON.stringify(body),
    headers,
  })
    .then((res) => res.json())
    .then((result) => {
      const obj = Object.assign({}, result);
      var comments = obj.comments;
      var userData = obj.userData;
      userlistdiv.innerHTML = "";
      if (comments.length == 0) {
        userData.forEach((userdata) => {
          if (id.value != userdata.id) {
            userdata.datetime = new Date();
            userlist(userdata);
          }
        });
      } else {
        var sortcomments = comments.reverse();
        var arr = [];
        var arr2 = [];
        sortcomments.forEach((value) => {
          userData.forEach((userdata) => {
            if (
              id.value != userdata.id &&
              sortcomments.findIndex(
                (e) => e.senderid == userdata.id || e.recievid == userdata.id
              ) >= 0
            ) {
              if (
                (value.recievid == userdata.id ||
                  value.senderid == userdata.id) &&
                arr.indexOf(userdata.id) == -1
              ) {
                arr.push(userdata.id);
                userdata.datetime = value.updatedAt;
                userlist(userdata);
              }
            } else if (
              id.value != userdata.id &&
              sortcomments.findIndex(
                (e) => e.senderid == userdata.id || e.recievid == userdata.id
              ) < 0 &&
              arr2.indexOf(userdata.id) == -1
            ) {
              console.log(userdata.id);
              arr2.push(userdata.id);
              userdata.datetime = new Date();
              userlist(userdata);
            }
          });
        });
      }
    });
}

function fetchComments() {
  let body = {
    senderid: id.value,
    recievid: recieverid.value,
  };
  const headers = {
    "Content-Type": "application/json",
  };
  fetch("/getcomment", { method: "POST", body: JSON.stringify(body), headers })
    .then((res) => res.json())
    .then((result) => {
      // element.scrollTop = element.scrollHeight;
      const obj = Object.assign({}, result);
      var comments = obj.comments;

      comments.forEach((comment) => {
        comment.time = comment.updatedAt;
        if (comment.senderid == id.value) {
          appendToDom(comment);
        } else {
          appendToDom2(comment);
        }
      });
    });
}

function daysDiff(dt1) {
  dt1 = new Date(dt1);
  let cureentdate = new Date();
  if (
    cureentdate.getFullYear() +
      cureentdate.getMonth() +
      cureentdate.getDate() ==
    dt1.getFullYear() + dt1.getMonth() + dt1.getDate()
  ) {
    return ` last seen ${moment(dt1).format("LT")}`;
  } else {
    return `last seen ${moment(dt1).format("d-m-Y")}`;
  }
}
usernewlis();
fetchComments();
