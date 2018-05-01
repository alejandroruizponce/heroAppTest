const fs = require('fs');
const request = require('request');
var merchants = require("../merchants.json");
var summary;
var events_summary = [];
var rawdata = fs.readFileSync('sample1.json');
var sample = JSON.parse(rawdata);
var cont = 0;
var totalEvents = sample.length;
var augmented = [];
var i,j;

var EventsControllers = function () { };

const getIndex = (req, res) => {
    res.render('index', {
		title: 'Hero AppTest'
	});
};

const processEvents = (req,res) => {
    for(i=0; i<totalEvents; i++){
      if(sample[i].type == "product-view"){
        var url = ("https://dev.backend.usehero.com/products/" + sample[i].data.product.sku_code);
        var options = {
            uri: url,
            method: 'GET',
            json:true,
            headers: {
              'x-hero-merchant-id': sample[i].merchant
            }
        }
        request(options, function(error, response, body){
            if(error) console.log(error);
            else {
              augmented[cont] = body;
              cont++;
              if(totalEvents == augmented.length-1){
                generateAugmented();
              }
            }
        });
      }
        else{
          for(j=0; j<sample[i].data.transaction.line_items.length; j++){
              var url = ("https://dev.backend.usehero.com/products/" + sample[i].data.transaction.line_items[j].product.sku_code);
              var options = {
                  uri: url,
                  method: 'GET',
                  json:true,
                  headers: {
                    'x-hero-merchant-id': sample[i].merchant
                  }
              }
              request(options, function(error, response, body){
                  if(error) console.log(error);
                  else {
                    augmented[cont] = body;
                    cont++;
                    if(totalEvents == augmented.length-1){
                      generateAugmented();
                    }
                  }
              });
          }
        }
      }

      function generateAugmented(){
        var t;
        for(i=0; i<totalEvents; i++){
          if(sample[i].type == "product-view"){
              for(j=0; j<augmented.length; j++){
                if(sample[i].data.product.sku_code == augmented[j].sku_code){
                  sample[i].data.product = augmented[j];
                }
              }
          }
          else{
              for(t=0; t<sample[i].data.transaction.line_items.length; t++){
                for(j=0; j<augmented.length; j++){
                  if(sample[i].data.transaction.line_items[t].product.sku_code == augmented[j].sku_code){
                    sample[i].data.transaction.line_items[t].product = augmented[j];
                  }
                }
              }
          }
        }
      }

      res.render('index2', {
  		title: 'Hero AppTest'
  	});
};

const summaryEvents = (req,res) => {
      let merchant = req.params.merchantid;
      let usersp = [];
      let userst = [];
      let c1 = 0,c2 = 0;

      let totevents = 0 ,nusersp = 0, nuserst = 0 ,toteventsp = 0 , toteventst = 0, totvalue = 0, ncustomers = 0, totalv = 0;
      for(i=0; i<sample.length; i++){
        if(sample[i].merchant == merchant){
          if(sample[i].type == "product-view"){
            toteventsp++;
            if(usersp.indexOf(sample[i].user) == -1){
              usersp[c1] = sample[i].user;
              c1++;
            }
          }
          else{
            toteventst++;
            if(userst.indexOf(sample[i].user) == -1){
              userst[c2] = sample[i].user;
              c2++;
            }
            for(j=0; j<sample[i].data.transaction.line_items.length; j++){
                totalv = totalv + sample[i].data.transaction.line_items[j].subtotal;
            }
          }
        }
      }

      totevents = toteventst + toteventsp;
      nusersp = c1;
      nuserst = c2;
      ncustomers = nusersp + nuserst;

      events_summary.push({
              type: "product-view",
              total_events: toteventsp,
              number_of_customers:nusersp
      });

      events_summary.push({
              type: "transaction",
              total_events: toteventsp,
              number_of_customers:nusersp,
              total_value: totalv
      });

      summary = {
        total_events: totevents,
        number_of_customers: ncustomers,
        events_summary: events_summary
      }

      res.json(summary);
};

const allEvents = (req, res) => {
  res.json(sample);
};


module.exports = {
  getIndex,
  processEvents,
  summaryEvents,
  allEvents
}
