

exports.index=(req,res)=>{

    res.render("comman/header", {
        pageTitle: "Home",
        path: "../main/home.ejs",
      });
}