// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.
 
$(document).ready( function(){
  
window.E = {
  date: function(){
    var d = new Date(),
        d = d.toString().split(" ");
    return{
      currentYear: function(){
        return d[3];
      },
      currentMonth: function(){
        return d[1];
      },
      currentDay: function(){
        return d[2];
      }
    }
  },
  
  today: function(){
    return [ E.date().currentYear(),E.months_in_a_year[ E.date().currentMonth()],E.date().currentDay()].join("-");
  },
  
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
    "Oct":"10",
    "Nov":11,
    "Dec":12
  },
  
  num_of_days_in_the_month:["31","28","31","30","31","30","31","31","30","31","30","31"],
  expenses_list: [],
  earnings: 0,
  expenses: 0,
  netAmount: 0,
  navigation: "<nav id='nav' class='grid_3'>\
      <a href='#' id='current_month' class='nav class='grid_3' clearfix'></a>\
      <a href='#' id='view_history' class='nav class='grid_3' clearfix'> View History </a>\
    </nav>",
  headerTemplate: "<header id='header' class='prefix_3 grid_21 clearfix'>\
     <h2></h2>\
     <ul id='balance_sheet' class='grid_17 pull_1'>\
       <li id='earnings' class='clearfix'>\
         <span class='label grid_3'>Earnings:</span><span class='value'> 30000</span>\
       </li>\
       <li id='expense_label' class='clearfix'>\
         <span class='label grid_3'>Expenses:</span><span class='value'> 10000</span>\
       </li>\
       <li id='net_amount' class='clearfix'>\
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
    if( data["id"] !== undefined ){
      return "<li id='expense_"+data["id"]+"' class='expense clearfix'><input type='text' class='date grid_4' value='"+this.splitDate( data["spent_on"] )+"'><input type='text' class='amount grid_4' value='"+data['amount']+"'><input type='text' class='reason grid_10' value='"+data["reason"]+"'>"+" <a href='#' class='delete'></a></li>";
    } else{
      return "<li class='expense clearfix'><input type='text' class='date grid_4' value='"+this.splitDate( data["spent_on"] )+"'><input type='text' class='amount grid_4' value='"+data['amount']+"'><input type='text' class='reason grid_10' value='"+data["reason"]+"'>"+" <a href='#' class='delete'></a></li>";      
    }
  },
  
  init: function(){    
    $("div.container_24:first").append( E.headerTemplate );
    $("div.container_24:first").append("<div id=main_content class='grid_24'>"+E.navigation+"<header id='control_bar' class=''></header><ul id='expenses' class='grid_21'></ul></div>");
    $("#expenses").append( E.expenseListHeading);
    
    // register uiEvents
    $("#add_transaction").live("click", this.uiEvents.addTransaction );
    $("li.expense a.delete").live("click", this.uiEvents.removeTransaction );
    $("li.expense input.amount").live("blur", this.uiEvents.checkAmount );
    $("li.expense").live("mouseenter", this.uiEvents.showDeleteLink).live("mouseleave", this.uiEvents.hideDeleteLink);
    $("#view_history").live("click", this.uiEvents.loadHistory );
    $("#current_month").live("click", this.uiEvents.loadCurrentMonth);
    $("#get_month_and_year").live("click", this.uiEvents.loadMonthAndYear );
    E.loadControls();
    E.loadExpenses();
    $("#header").children("h2:first").html( E.date().currentMonth()+" "+E.date().currentYear()+" Balance Summary");
    $("#nav").children("a:first").html( E.date().currentMonth()+" "+E.date().currentYear());
  },
  
  resetBalanceSheet: function(){
    $("#earnings").children("span[class='value']:first").html(" ");
    $("#expense_label").children("span[class='value']:first").html(" ");
    $("#net_amount").children("span[class='value']:").html(" ");
  },
  
  loadControls: function(){
    var month_year="";
    
    month_year = [];
    month_year.push( E.loadMonths() );
    month_year.push( E.loadYear() );
    month_year.push( "<input type='button' id='get_month_and_year' class='get_month_and_year' value='Go'></input>");
    $("#control_bar").html( month_year.join("\n") );
  },
  
  loadMonths: function(){
    var months, month;
    months=["<select id='history_month'>"];
    for(month in E.months_in_a_year){
      months.push( "<option value="+parseInt(E.months_in_a_year[month], 10)+">"+month+"</option>");
    }
    months.push("</select>")
    return months.join("\n");
  },
  
  loadYear: function(){
    var arr_year, i, year;
    arr_year = ["<select id='history_year'>"];
    i = 2011;
    for( i = 2011; i >= 1900; i-- ){
      arr_year.push( "<option value="+i+">"+i+"</option>" );
    }
    arr_year.push("</select>");
    
    return arr_year.join("\n");
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
             E.calculateNetEarnings();
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
      var id = $(e.target).parents("li.expense:first").attr("id").split("_")[1];
          reason = $("#expense_"+id).find("input.reason:first").attr("value");
          date = $("#expense_"+id).find("input.date:first").attr("value");
          amount = $("#expense_"+id).find("input.amount:first").attr("value");
    
      if ( isNaN(parseFloat(amount) ) && ( $(e.target).hasClass("amount") ) ){
        var errorMessage = "<span class='invalid_entry'><span class='arrow-border'></span><span class='text'>Amount needs to be a number like 1000</span></span>";
        $(e.target).after(errorMessage);
        $(e.target).parents("li.expense").children("span.invalid_entry").show();
      } else{
        //update the content
        $(e.target).parents("li.expense").children("span.invalid_entry").remove();
        if( !isNaN(parseFloat(amount) ) ){
          $.ajax({
            url:"/expenses/"+id,
            type: "PUT",
            data:"[expense][reason]="+reason+"&[expense][spent_on]="+date+"&[expense][amount]="+amount,
            dataType: "json",
            success: function(data){
              console.log("success");
              E.calculateNetEarnings();
            },
            failure: function(data){
              console.log("failure");
            },
            error: function(data){
              console.log( data );
              console.log("error");
            }
          });
        }
      }
    },
    
    loadMonthAndYear: function( event ){
      var year, month;
      
      event.preventDefault();
      
      year = $("#history_year").val();
      month = $("#history_month").val();
      
      $.ajax({
        url: "expenses/get_expenses",
        data: "month="+month+"&year="+year,
        success: function(data){
          E.resetBalanceSheet();
          $("#expenses").children("li.expense").remove();
          $("#header").children("h2:first").html(E.months[ month-1 ]+" "+year+" Balance Summary");
          
          var data = JSON.parse(data),
              i = 0;

          for( i = 0; i < data.length; i++ ){
             E.addExpense( data[i] ) ;
          }             
          E.calculateNetEarnings();   
        },
        failure: function(data){
          alert(" Not able to load data due to: "+data);
        }
      });
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
    },
    
    loadHistory: function(event){
      event.preventDefault();
      $("#expenses").children("li.expense").remove();
      $("#control_bar").toggle();
    },
    
    loadCurrentMonth: function(event){
      event.preventDefault();
      $("#expenses").children("li.expense").remove();
      $("#header").children("h2:first").html(E.date().currentMonth()+" "+E.date().currentYear()+" Balance Summary");
          E.loadExpenses();
      $("#control_bar").toggle();
    }
  },
  
  loadExpenses: function(){
    var currentMonth = E.months_in_a_year[ E.date().currentMonth() ];
    var currentYear = E.date().currentYear();
    
    $.ajax({
      url: "expenses/get_expenses",
      data: "month="+currentMonth+"&year="+currentYear,
      success: function(data){
        var data = JSON.parse(data),
            i = 0;
            
        for( i = 0; i < data.length; i++ ){
           E.addExpense( data[i] ) ;
        }             
        E.calculateNetEarnings();   
      },
      failure: function(data){
        alert(" Not able to load data due to: "+data);
      }
    });
    
  },
  
  calculateNetEarnings: function(){
    var currentAmount = 0, totalEarnings = 0, totalExpenses = 0;
    
    $("li.expense input.amount").each( function(index, amt){      
      currentAmount = parseFloat( $(amt).val() );
      
      if( currentAmount >= 0 ){
        totalEarnings = totalEarnings + currentAmount;
      } else if( currentAmount < 0 ){
        totalExpenses = totalExpenses - currentAmount;
      }
    });
    
    E.earnings = totalEarnings;
    E.expenses = totalExpenses;
    E.netAmount = totalEarnings - totalExpenses;
    
    $("#balance_sheet li#earnings span.value:first").html( totalEarnings );
    $("#balance_sheet li#expense_label span.value:first").html( totalExpenses );
    $("#balance_sheet li#net_amount span.value:first").html( E.netAmount ); 
  },
  
  addExpense: function(expense){
      if( ( expense !== null) && ( typeof expense === "object") ){
        E.expenses_list.push( expense );
        $("#expenses").append( E.expenseTemplate(expense) );
      }
  }
};

E.init();
$("input.date").calendar();

});


