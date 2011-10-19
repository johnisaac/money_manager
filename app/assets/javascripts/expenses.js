// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.

window.E = {
  expenses: [],
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
  
  expenseTemplate: function(data){
    return "<li id='expense_"+data["id"]+"' class='expense clearfix'><input type='text' class='date grid_4' value='"+this.splitDate( data["spent_on"] )+"'><input type='text' class='amount grid_4' value='"+data['amount']+"'><input type='text' class='reason grid_10' value='"+data["reason"]+"'>"+" <a href='#' class='delete'></a></li>";
  },
  
  init: function(){
    $("div.container_24:first").append( E.headerTemplate );
    $("div.container_24:first").append("<ul id='expenses' class='grid_21'></ul>");
    $("#expenses").append( E.expenseListHeading);
    
    // register uiEvents
    $("#add_transaction").live("click", this.uiEvents.addTransaction );
    $("li.expense a.delete").live("click", this.uiEvents.removeTransaction );
    $("li.expense input[type='text'].amount").live("blur", this.uiEvents.checkAmount );
    $("li.expense").live("mouseenter", this.uiEvents.showDeleteLink).live("mouseleave", this.uiEvents.hideDeleteLink);
    E.loadExpenses();
  },
  
  uiEvents: {
    addTransaction: function(e){
      var newLi = "<li class='expense clearfix'><input type='text' class='date grid_4' placeholder='Transaction Date'></input><input type='text' class='amount grid_4' placeholder='Transaction Amount'> </input><input type='text' class='reason grid_10' placeholder='What was the transaction'></input><a href='#' class='delete'></a></li>";
      $("#expenses li.header").after( newLi );

      e.preventDefault();
      return false;
    },
    removeTransaction: function(e){
      var next = $(e.target).parent().next();
      $(e.target).parents("li.expense:first").remove();
      $(next).find("a.delete").show();
      e.preventDefault();
      return false;
    },
    checkAmount: function(e){
      console.log("update the expense here");
      var errorMessage = "<span class='invalid_entry'><span class='arrow-border'></span><span class='text'>Amount needs to be a number like 1000</span></span>";
      $(e.target).after(errorMessage);
      $(e.target).parents("li.expense").children("span.invalid_entry").show();
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
  }
}

E.init();

