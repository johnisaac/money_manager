$.fn.calendar = function(){
  "use strict";
  var el, dateEl, numOfDaysInMonths, daysOfTheWeek, monthsOfTheYear, currentDayIndex, currentMonth, currentYear, currentDay, currentFormat, dateFormat;

  el =  null;
  dateEl = $(this);
  numOfDaysInMonths = ["31","28","31","30","31","30","31","31","30","31","30","31"];
  daysOfTheWeek = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  monthsOfTheYear = [ "Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec" ];
  currentDayIndex = 1;
  currentMonth = 1;
  currentYear = 2011;
  currentDay = 'Sun';
  currentFormat ="DD-MM-YYYY";
  dateFormat = [ "DD-MM-YYYY","DD-MON-YYYY"];

  function createCalendar(element){
      //<div class='cal_footer'>Go to Today</div>
      $(element).after("<div class='calendar'><div class='cal_header'><span class='prev_month'></span><span class='month_year'></span><span class='next_month'></span><a href='#' class='close'>X</a></div><div class='dates'></div></div>");    
      el = $(element).next("div.calendar:first");
  }

   function blankDays( day ){
     var i=0;
     for( i = 0; i < 7; i++ ){
       if( daysOfTheWeek[i] === day ){
         return i;
       }
     }
     return undefined;
   }
  
   function isLeapYear(year){
       if( ( year%4 === 0 ) && ( year %100 === 0) && ( year % 400 === 0 ) ){
         return true;
       } else{
         return false;
       }
   }

   function getMonthIndex( monthName ){
       var i;
       for( i = 0; i < 12; i++ ){
          if( monthsOfTheYear[i] === monthName){
            return i;
          }
        }
       return undefined;
   }

  function loadCalendarData(loadMonth, loadDay, loadYear){
      var firstDate, numOfBlankDays, numOfMonthDays, day, month, dates;
      numOfMonthDays = 0;

      firstDate = new Date( [ loadMonth,"1",loadYear].join("-"));
      numOfBlankDays = blankDays( firstDate.toString().split(" ")[0] );
      dates = $(el).children("div.dates:first");
      day = 1;
      month =[];


      if( isLeapYear(loadYear) && ( loadMonth === 1 ) ){
        numOfMonthDays = parseFloat(numOfDaysInMonths[getMonthIndex( loadMonth )]) + 1;
      } else {
        numOfMonthDays = numOfDaysInMonths[parseFloat(getMonthIndex( loadMonth ) )];
      } 

      while( day <= numOfBlankDays){
        month.push("<a href='#' class='day'></a>");
        day = day + 1;
      }

      for( day = 1; day <= numOfMonthDays; day++ ){
        if( day === parseInt( loadDay, 10) ){
          month.push("<a href='#' class='day today'>"+day+"</a>");
        } else{
          month.push("<a href='#' class='day'>"+day+"</a>");
        }
      }
      $(el).children("div.cal_header:first").children("span.month_year:first").html( currentMonth+" "+ currentYear );
      $(dates).html( month.join(" ") );
  }

   function currentDate(){
       var d = new Date();
       d = d.toString().split(" ");
       currentDay = d[0];
       currentMonth = d[1];
       currentDayIndex = d[2];
       currentYear = d[3];
    }

    function prevMonth(){
       var currentMonthIndex, i;
       for( i = 0; i < 12; i++ ){
         if( monthsOfTheYear[i] === currentMonth){
           if( i === 0){
             currentMonth = monthsOfTheYear[11];
             currentYear = parseFloat( currentYear ) - 1;
           } else{
             currentMonth = monthsOfTheYear[ i - 1 ];
           }
           break;
         }
       }
     }
     
     function nextMonth(){
       var i;
       for( i = 0; i < 12; i++ ){
         if( monthsOfTheYear[i] === currentMonth){
           if( i === 11){
             currentMonth = monthsOfTheYear[0];
             currentYear = parseFloat( currentYear ) + 1;
           } else{
             currentMonth = monthsOfTheYear[ i + 1 ];
           }
           break;
         }
       }          
     }
     
     function onClickPrevMonth(e){
       prevMonth();
       loadCalendarData( currentMonth, currentDayIndex, currentYear );

       e.preventDefault();
       return false;
     }
     
     function onClickNextMonth(e){
       nextMonth();
       loadCalendarData( currentMonth, currentDayIndex, currentYear );

       e.preventDefault();
       return false;
      }

     function formattedMonth( month ){
       if( currentFormat !== "DD-MON-YYYY"){
         return parseInt( getMonthIndex( currentMonth || month ), 10 )+1;
       } else if( currentFormat === "DD-MM-YYYY"){
         return currentMonth || month;
       }
     }

     function onDayClick(e){
       var expenseID, expense, date;
       
       expense = $(e.target).parents("div.calendar:first").prev("input.date:first").parent("li.expense");
       expenseID = $(expense).attr("id").split("_")[1];
       currentDayIndex = $(e.target).html();
       $(e.target).parents("div.calendar:first").prev("input.date:first").attr("value", [ currentDayIndex, formattedMonth(), currentYear ].join("-") );
       $(e.target).parents("div.calendar:first").prev("input.date:first").removeAttr("disabled");
       $(e.target).parents("div.calendar:first").prev("input.date:first").blur();
       date = [ currentDayIndex, formattedMonth(), currentYear ].join("-");
       $(el).remove();
       
       $.ajax({
          url:"/expenses/"+expenseID,
          type: "PUT",
          data:"[expense][spent_on]="+date,
          dataType: "json",
          success: function(data){
            console.log("success");
          },
          failure: function(data){
            console.log("failure");
          },
          error: function(data){
            console.log( data );
            console.log("error");
          }
       });
              
       e.preventDefault();
       //return [ currentDayIndex, formattedMonth(), currentYear ].join("-");
       return false;
     }

     function onClose(e){
       $(e.target).parents("div.calendar:first").prev("input.date:first").removeAttr("disabled");
       $(e.target).parents("div.calendar:first").prev("input.date:first").blur();
       $(e.target).parents("div.calendar:first").remove();
       e.preventDefault();
       return false;
     }

     function checkCalendarCount(){
       if( ( $(dateEl) !== null ) && ( $(dateEl) !== undefined) ){
         if( $(dateEl).parent("li.expense:first").children("div.calendar") === 0 ){
           return false;
         } else{
           return true;
         }
       }
     }
     
     function onFocus(e){
       $(e.target).attr("disabled","");
       var currentDate = $(e.target).attr("value").split("-");
       if ( checkCalendarCount() ){
         $("div.calendar").remove();
         createCalendar( e.target );
       }
       
       if( ( currentDate.length === 3 ) && ( currentFormat === "DD-MON-YYYY") ){
         currentMonth = formattedMonth( currentDate[1] );
         currentDayIndex = currentDate[0];
         currentYear = currentDate[2];
       } else if(  ( currentDate.length === 3 ) && ( currentFormat === "DD-MM-YYYY") ){
         currentMonth = monthsOfTheYear[ parseInt( currentDate[1], 10 )-1 ];
         currentDayIndex = currentDate[0];
         currentYear = currentDate[2];
       }

       loadCalendarData( currentMonth, currentDayIndex, currentYear );
       
       e.preventDefault();
       return false;
     }

     function onBlur(e){
       e.preventDefault();
       $(e.target).removeAttr("disabled");
     }

   currentDate();
   //events();
   $(this).live("focus", onFocus ); 
   $("span.prev_month").live("click", onClickPrevMonth );
   $("span.next_month").live("click", onClickNextMonth );
   $("a.day").live("click", onDayClick);
   $("a.close").live("click", onClose);
   $(this).live("blur", onBlur);
 };