const producthelpers = require("../helpers/product-helpers");

  module.exports.viewAllProducts=async (req, res) => {
    let category1=req.params.name
    console.log(category1);

    let page={}
    page.total=await producthelpers.getCountProducts()
    console.log("LLL+++++++++++++");
    console.log(page.total);
    page.perpage=3
    page.pages=Math.ceil(page.total/page.perpage)
    page.pageno=(req.query.page==null)?1:parseInt(req.query.page)
    page.startFrom=(page.pageno -1)*page.perpage
    let pro=await producthelpers.getproductsp(page)
    let member = req.session.user;
    console.log("???????");
    console.log(page);
  
   res.render('viewAllProducts',{user:true,pro,page,category1,member})
  }

  module.exports.viewFilterProducts=async (req, res) => {
    filter=await producthelpers.getFilter(req.body)
    console.log(filter);
    let member = req.session.user;
  
    res.render("viewFilterProducts",{user:true,filter,member})
    }

    module.exports.productSearch= (req, res) => {
        producthelpers.searchProducts(req.body).then((pro) => {
         console.log(pro);
           res.render('viewAllProducts', { user: true, pro})
         })
       }


       module.exports.showProducts=async(req, res) => {
        let page={}
        let category1=req.params.name
        page.total=await producthelpers.getCount(req.params.name)
        page.perpage=2
        page.pages=Math.ceil(page.total/page.perpage)
        page.pageno=(req.query.page==null)?1:parseInt(req.query.page)
        page.startFrom=(page.pageno -1)*page.perpage
          let member = req.session.user;
          let count=await producthelpers.getReviewCount(req.params.id)
          
          console.log("{}{}{}{");
          console.log(count);
      
          producthelpers.productdetails(req.params.id).then((pro) => {
            console.log("_+_+__");
            console.log(pro);
          producthelpers.getcategoryproduct(pro.category,page).then((related) => {
          res.render("product", { user: true, member, pro, related,count });
            });
          });
        };
        module.exports.showCategoryProducts=async(req, res) => {
          let page={}
          let category1=req.params.name
          page.total=await producthelpers.getCount(req.params.name)
          page.perpage=2
          page.pages=Math.ceil(page.total/page.perpage)
          page.pageno=(req.query.page==null)?1:parseInt(req.query.page)
          page.startFrom=(page.pageno -1)*page.perpage
          let member = req.session.user;
          producthelpers.getcategoryproduct(req.params.name,page).then((product) => {
            console.log("{{}{}{}{}{");
            console.log(category1);
            res.render("category", { user: true, member, product,page,category1});
          });
        };     




  

