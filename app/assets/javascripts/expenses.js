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
      
      console.log( newExpense );
      
      var newLi = E.expenseTemplate( newExpense );
      
      console.log( newLi );
      $("#expenses li.header").after( newLi );
      // create a transaction with today's date and amount equal 0.0
      
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
      console.log("update the expense here");
      var amount = $(e.target).attr("value"),
          id = $(e.target).parents("li.expense:first").attr("id").split("_")[1];
          reason = $("#expense_"+id).find("input.reason:first").attr("value");
          date = $("#expense_"+id).find("input.date:first").attr("value");
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
  }
}

E.init();

