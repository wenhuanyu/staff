/**
 * 自定义多列时间选择器
 */
function withData(param) {
  return param < 10 ? '0' + param : '' + param;
}
function getLoopArray(start, end, str = '') {
  var start = start || 0;
  var end = end || 1;
  var array = [];
  for (var i = start; i <= end; i++) {
    array.push(withData(i)+str);
  }
  return array;
}
function getMonthDay(year, month,endDay,str = '') {
  var flag = year % 400 == 0 || (year % 4 == 0 && year % 100 != 0), array = null;
 
  switch (month) {
    case '01':
    case '03':
    case '05':
    case '07':
    case '08':
    case '10':
    case '12':
      array = getLoopArray(1, endDay ? endDay : 31, str)
      break;
    case '04':
    case '06':
    case '09':
    case '11':
      array = getLoopArray(1, endDay ? endDay : 30, str)
      break;
    case '02':
      array = flag ? getLoopArray(1, endDay ? endDay : 29, str) : getLoopArray(1, endDay ? endDay : 28, str)
      break;
    default:
      array = '月份格式不正确，请重新输入！'
  }
  return array;
}
function getNewDateArry() {
  // 当前时间的处理
  var newDate = new Date();
  var year = withData(newDate.getFullYear()),
    mont = withData(newDate.getMonth() + 1),
    date = withData(newDate.getDate()),
    hour = withData(newDate.getHours()),
    minu = withData(newDate.getMinutes()),
    seco = withData(newDate.getSeconds());
  return [year, mont, date, hour, minu, seco];
}
function dateTimePicker(endTime,startYear, endYear, date) {
  // 返回默认显示的数组和联动数组的声明
  var dateTime = [], dateTimeArray = [[], [], [], [], [], []];
  var dateArray = [[], [], [], [], [], []];
  var start = startYear || 2000;
  var end = endYear || 2100;
  // 默认开始显示数据
  var defaultDate = date ? [...date.split(' ')[0].split('-'), ...date.split(' ')[1].split(':')] : getNewDateArry();
  // 处理联动列表数据
  /*年月日 时分秒*/
  dateArray[0] = getLoopArray(start, end);
  dateArray[1] = getLoopArray(1, 12);
  dateArray[2] = getMonthDay(defaultDate[0], defaultDate[1]);
  dateArray[3] = getLoopArray(0, 23);
  dateArray[4] = getLoopArray(0, 59);
  dateArray[5] = getLoopArray(0, 59);
  
  if(endTime){
	  var newDate = new Date();   //当前时间
	  var nowTime = newDate.getTime()
	  var endTime = nowTime+(Number(endTime)*24*60*60*1000)
	  var endYear = end
	  var endMoney = new Date(endTime).getMonth()+1
	  var endDay = new Date(endTime).getDate()
	  var endhour = new Date(endTime).getHours()
	  var endminu = new Date(endTime).getMinutes()
	  var endseco = new Date(endTime).getSeconds()
	  // console.log(endYear,endMoney,endDay,endhour,endminu,endseco)
	  dateTimeArray[0] = getLoopArray(start, endYear);
	  dateTimeArray[1] = getLoopArray(1, endMoney);
	  dateTimeArray[2] = getMonthDay(defaultDate[0], defaultDate[1],defaultDate[1] < endMoney ? null : endDay);
  }else{
	  dateTimeArray[0] = getLoopArray(start, end);
	  dateTimeArray[1] = getLoopArray(1, 12);
	  dateTimeArray[2] = getMonthDay(defaultDate[0], defaultDate[1],null);
  }
  dateTimeArray[3] = getLoopArray(0, 23);
  dateTimeArray[4] = getLoopArray(0, 59);
  dateTimeArray[5] = getLoopArray(0, 59);
  
  dateArray.forEach((current, index) => {
    dateTime.push(current.indexOf(defaultDate[index]));
  });
 
  return {
    dateTimeArray: dateTimeArray,
    dateTime: dateTime,
	dateArray: dateArray
  }
}
module.exports = {
  dateTimePicker: dateTimePicker,
  getMonthDay: getMonthDay,
  getNewDateArry:getNewDateArry
}