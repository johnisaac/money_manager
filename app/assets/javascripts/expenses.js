// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.

$("#add_transaction").click( function(e){
  var newLi = "<li class='expense clearfix'><input type='text' class='date grid_4' placeholder='Transaction Date'></input><input type='text' class='amount grid_4' placeholder='Transaction Amount'> </input><input type='text' class='reason grid_10' placeholder='What was the transaction'></input><a href='#' class='delete'> X</a></li>";
  $("#expenses li.header").after( newLi );
  
  e.preventDefault();
  return false;
});

$("li.expense").live("mouseenter", function(e){  
  $(e.target).find( "a.delete:first" ).show();
  e.preventDefault();
  return false;
}).live("mouseleave", function(e){
  var target;  
  target = $(e.target).hasClass("expense")?  $(e.target):  $(e.target).parents("li.expense");

  $(target).find( "a.delete:first" ).hide();
  
  e.preventDefault();
  return false;
});

$("li.expense a.delete").live("click", function(e){
  var next = $(e.target).parent().next();
  $(e.target).parents("li.expense:first").remove();
  $(next).find("a.delete").show();
  e.preventDefault();
  return false;
});

$("li.expense input[type='text']").live("blur", function(e){
  //update the expense here.
  console.log("update the expense here");
});
/*
E = {
  expenses: [],
  heading: "<li id='heading' class='grid_24'></li>",
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
    return "<li id='expense_"+data["id"]+"' class='expense clearfix grid_24'><input type='text' class='date grid_5 clearfix'>"+this.splitDate( data["spent_on"] )+"</input><input type='text' class='clearfix amount grid_5'>"+data['amount']+"</input><input type='text' class='clearfix reason grid_20'>"+data["reason"]+"</input>"+"</li>";
  },
  
  init: function(){
    $("body").append("<ul id='expenses' class='grid_24'></ul>");
    //append Expense Heading
    $("body").append( E.heading);
    E.loadExpenses();
  },
  
  events: function(){
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
*/
