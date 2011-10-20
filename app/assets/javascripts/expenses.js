// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.
$(document).ready( function(){
window.E = {
  expenses: [],
  months : [ "Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec" ],
  day_of_the_week: {
    "Sun":0,
    "Mon":1,
    "Tue":2,
    "Wed":3,
    "Thu":4,
    "Fri":5,
    "Sat":6
  },
  months_in_a_year:{
    "Jan":"01",
    "Feb":"02",
    "Mar":"03",
    "Apr":"04",
    "May":"05",
    "June":"06",
    "July":"07",
    "Aug":"08",
    "Sept":"09",
    "Oct":10,
    "Nov":11,
    "Dec":12
  },
  num_of_days_in_the_month:["31","28","31","30","31","30","31","31","30","31","30","31"],
  headerTemplate: "<header id='header' class='clearfix'>\
     <h2>October 2011 Balance Summary</h2>\
     <ul id='balance_sheet' class='grid_17'>\
       <li id='earnings'>\
         <span class='label grid_3'>Earnings:</span><span class='value'> 30000</span>\
       </li>\
       <li id='expense_label'>\
         <span class='label grid_3'>Expenses:</span><span class='value'> 10000</span>\
       </li>\
       <li id='net_amount'>\
         <span class='label grid_3'>Net Amount:</span><span class='value'> 20000</span>\
       </li>\
     </ul>\
     <a href='#' id='add_transaction' class='grid_3'>\
         Add Transaction\
     </a>\
   </header>",
  
  expenseListHeading: "<li class='header clearfix'>\
     <span class='date grid_4'>\
       Spent on\
     </span>\
     <span class='amount grid_4'>\
       Amount(in Rs)\
     </span>\
     <span class='reason grid_10'>\
       Reason\
     </span>\
   </li>",
   
  splitDate: function(date){
    var newDate;
    try{
      newDate = date.split("T")[0].split("-");
      return newDate[2]+"-"+newDate[1]+"-"+newDate[0];
    }catch(e){
      console.log(e);
    }
  },
  
  today:function(){
    var d = new Date(),
        date =[];

    date.push( d.getFullYear() );    
    date.push( d.getMonth() );
    date.push( d.getDate() );
    
    return date.join("-");
  },
  
  expenseTemplate: function(data){
    if( data["id"] !== undefined ){
      console.log( data["spent_on"] );
      return "<li id='expense_"+data["id"]+"' class='expense clearfix'><input type='text' class='date grid_4' value='"+this.splitDate( data["spent_on"] )+"'><input type='text' class='amount grid_4' value='"+data['amount']+"'><input type='text' class='reason grid_10' value='"+data["reason"]+"'>"+" <a href='#' class='delete'></a></li>";
    } else{
      return "<li class='expense clearfix'><input type='text' class='date grid_4' value='"+this.splitDate( data["spent_on"] )+"'><input type='text' class='amount grid_4' value='"+data['amount']+"'><input type='text' class='reason grid_10' value='"+data["reason"]+"'>"+" <a href='#' class='delete'></a></li>";      
    }
  },
  
  init: function(){
    $("div.container_24:first").append( E.headerTemplate );
    $("div.container_24:first").append("<ul id='expenses' class='grid_21'></ul>");
    $("#expenses").append( E.expenseListHeading);
    
    // register uiEvents
    $("#add_transaction").live("click", this.uiEvents.addTransaction );
    $("li.expense a.delete").live("click", this.uiEvents.removeTransaction );
    $("li.expense input[type='text']").live("blur", this.uiEvents.checkAmount );
    $("li.expense").live("mouseenter", this.uiEvents.showDeleteLink).live("mouseleave", this.uiEvents.hideDeleteLink);
    E.loadExpenses();
  },
  
  uiEvents: {
    addTransaction: function(e){
      var newExpense = {
        "spent_on": E.today(),
        "amount"  : 0.0,
        "reason"  : "" 
      };
            
      var newLi = E.expenseTemplate( newExpense );
      
      $("#expenses li.header").after( newLi );
      
      $.ajax({
        url: "/expenses/",
        type: "POST",
        data:"[expense][spent_on]="+newExpense.spent_on+"&[expense][amount]="+newExpense.amount,
        dataType: "json",
        success: function(data){
          $("#expenses li.expense:first").attr("id","expense_"+data["id"]);
        }, 
        failure: function(data){
          console.log( data );
        }
      });
      
      e.preventDefault();
      return false;
    },
    removeTransaction: function(e){
      var next = $(e.target).parent().next(),
          parent = $(e.target).parents("li.expense:first"),
          id;
      if( $(parent).attr("id") !== undefined ){
        id = $(parent).attr("id").split("_")[1];
        $.ajax({
          url: "/expenses/"+id,
          type:"DELETE",
          success: function(data){
             $(parent).remove();
          },
          failure: function(data){
            console.log("there is an failure while removing the transaction");
          },
          error: function(data){
            console.log("there is an error while removing the transaction");          
          }
        });
      }else{
         $(parent).remove();
      }
      
      $(next).find("a.delete").show();
      e.preventDefault();
      return false;
    },
    checkAmount: function(e){
      console.log(e);
      console.log("update the expense here");
      var id = $(e.target).parents("li.expense:first").attr("id").split("_")[1];
          reason = $("#expense_"+id).find("input.reason:first").attr("value");
          date = $("#expense_"+id).find("input.date:first").attr("value");
          amount = $("#expense_"+id).find("input.amount:first").attr("value");
      console.log( amount );
    
      if ( isNaN(parseFloat(amount) ) && ( $(e.target).hasClass("amount") ) ){
        var errorMessage = "<span class='invalid_entry'><span class='arrow-border'></span><span class='text'>Amount needs to be a number like 1000</span></span>";
        $(e.target).after(errorMessage);
        $(e.target).parents("li.expense").children("span.invalid_entry").show();
      } else{
        //update the content
        $(e.target).parents("li.expense").children("span.invalid_entry").remove();
        
        $.ajax({
          url:"/expenses/"+id,
          type: "PUT",
          data:"[expense][reason]="+reason+"&[expense][spent_on]="+date+"&[expense][amount]="+amount,
          dataType: "json",
          success: function(data){
            console.log("success");
          },
          failure: function(data){
            console.log("failure");
          }
        });
      }
      
    },
    showDeleteLink: function(e){
      $(e.target).find( "a.delete:first" ).show();
      e.preventDefault();
      return false;
    },
    hideDeleteLink: function(e){
      var target;  
      target = $(e.target).hasClass("expense")?  $(e.target):  $(e.target).parents("li.expense");

      $(target).find( "a.delete:first" ).hide();

      e.preventDefault();
      return false;
    }
  },
  
  loadExpenses: function(){
    $.ajax({
      url: "expenses/get_expenses",
      success: function(data){
        var data = JSON.parse(data),
            i = 0;
            
        for( i = 0; i < data.length; i++ ){
           E.addExpense( data[i] ) ;
        }        
        
        E.addExpense();
      },
      failure: function(data){
        alert(" Not able to load data due to: "+data);
      }
    });
    
  },
  
  addExpense: function(expense){
      if( ( expense !== null) && ( typeof expense === "object") ){
      E.expenses.push( expense );
      $("#expenses").append( E.expenseTemplate(expense) );
    }
  },
  
  isLeapYear: function(year){
    if( ( year%4 === 0 ) && ( year %100 === 0) && ( year % 400 === 0 ) ){
      return true;
    } else{
      return false;
    }
  }
}

E.init();
//$("input.date").calendar();
    
$("input.date").live("focus", function(e){
  // find out which month
  // find out which year
  // find out on what day does the month starts
  // find out how many days does the current month has.  
  var currentDay, currentMonth, currentYear, currentDate, dates, day, numOfBlankDays, firstDate;
  
  currentDate = $(e.target).attr("value").split("-");
  currentDay = currentDate[0];
  currentMonth = currentDate[1]-1;
  currentYear = currentDate[2];
  currentDate = new Date( currentDate[1]+"-"+currentDate[0]+"-"+currentDate[2] );
  firstDate = new Date( ( currentMonth+1)+"-1-"+currentYear);
  
  console.log( currentDate );
  console.log( firstDate );
  
  numOfBlankDays = E.day_of_the_week[ firstDate.toString().split(" ")[0] ];
  console.log( firstDate.toString().split(" ")[0] );
  console.log( E.day_of_the_week[ firstDate.toString().split(" ")[0] ]  );
  console.log( numOfBlankDays );
  numOfMonthDays = 0;
  
  if( E.isLeapYear(currentYear) && ( currentMonth === 1 ) ){
    numOfMonthDays = parseInt(E.num_of_days_in_the_month[currentMonth]) + 1;
  } else {
    numOfMonthDays = E.num_of_days_in_the_month[currentMonth];
  }

  $(e.target).after("<div class='calendar'><a href='#' class='close'>X</a><div class='cal_header'>"+E.months[currentMonth]+" "+currentYear+"</div><div class='dates'></div><div class='cal_footer'>Go to Today</div></div>");  
  dates = $(e.target).next("div.calendar:first").children("div.dates:first");
  day = 1;
  month =[];  
  
  while( day <= numOfBlankDays){
    month.push("<a href='#' class='day'></a>");
    day = day + 1;
  }
  
  for( day = 1; day <= numOfMonthDays; day++ ){
    if( day === parseInt( currentDay) ){
      month.push("<a href='#' class='day today'>"+day+"</a>");
    } else{
      month.push("<a href='#' class='day'>"+day+"</a>");
    }
  }

  $(dates).html( month.join(" ") );
});

$("a.day").live("click", function(e){
  var selectedDay, el, header, selectedYear, selectedMonth, currentDateEl;  
  selectedDay = $(e.target).html();
  el = $(e.target).parents("div.calendar:first");
  header = $(el).children("div.cal_header:first").html().split(" ");
  selectedYear = header[1];
  selectedMonth = E.months_in_a_year[ header[0] ];
  currentDateEl = $(el).prev("input.date:first");
  $(currentDateEl).attr("value",[selectedDay, selectedMonth, selectedYear].join("-"));
  $(el).remove();
  
  $(currentDateEl).trigger("blur");
  
  e.preventDefault();
  return false;
});

$("a.close").live("click", function(e){
  var el;
  
  el = $(e.target).parents("div.calendar:first")
  $(el).remove();
  
  e.preventDefault();
  return false;  
});

});

$.fn.calendar = function(e){
  var that = $(this);
  console.log( $(that) );

  
};
