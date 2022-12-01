
let data = new Date() //当前日期
let year = Number(data.getFullYear());//当前年
let month = Number(data.getMonth())+1;
let nowMonth =Number(data.getMonth()); //当前月
let day = Number(data.getDate()); //当天
let mydate=new Date(year,month-1,day);
let weekday=mydate.getDay(); //获取该日是星期几，0代表星期日//今天本周的第几天
let weekno=Math.ceil((day + 6 - weekday) / 7); // 本月第几周

//获取当前周的开始结束时间
function formatDate(date) {
	let myyear = Number(date.getFullYear());
	let mymonth = Number(date.getMonth()+1);
	let myweekday = Number( date.getDate());   
	if(mymonth < 10){
		mymonth = "0" + mymonth;
	}
	if(myweekday < 10){
		myweekday = "0" + myweekday;
	}
	return (myyear+"-"+mymonth + "-" + myweekday);
}

//获得本周的开始日期
function getWeekStartDate() {
	let weekStartDate = new Date(year, nowMonth, day - weekday);
	return formatDate(weekStartDate);
}

//获得本周的结束日期
function getWeekEndDate() {
	let weekEndDate = new Date(year, nowMonth, day + 6 - weekday);
	return formatDate(weekEndDate);
}
//获取本周 所有日期
function getWeekDay() {
	let weekStartDate = new Date(year, nowMonth, day - weekday);
	let weekStartTime = new Date(weekStartDate).getTime()
	console.log(weekStartDate,weekStartTime)
	let time = 24*60*60*1000   //一天的毫秒时间
	let arr = [{date:'',week:'',day:''},{date:'',week:'',day:''},{date:'',week:'',day:''},{date:'',week:'',day:''},{date:'',week:'',day:''},{date:'',week:'',day:''},{date:'',week:'',day:''}]
	for( i=0; i<7; i++ ) {
		let daytime = new Date(weekStartTime + (i*time))
		let date = formatDate(daytime)
		let d = daytime.getDate()
		arr[i].date = date
		arr[i].week = i+1
		arr[i].day = d
	}
	return arr
}

//获取 今天 day
function getNowDay() {
	var date = new Date();
	var day = date.getDate();
	return day
}

//当天
function getNowData() {
	return year+'-'+(month >= 10 ? month : '0'+month)+'-'+(day >= 10 ? day : '0'+day)
}

//本月的开始 时间
function getMonthFirstDay() {
	var monthStartDate = new Date(year, nowMonth, 1);
	let fy = new Date(monthStartDate).getFullYear()
	let fm = new Date(monthStartDate).getMonth() + 1
	let fd = new Date(monthStartDate).getDate()
	return fy+'-'+(fm >= 10 ? fm : '0'+fm)+'-'+(fd >= 10 ? fd : '0'+fd)
}

//本月的 结束 时间
function getMonthLastDay() {
	var monthEndDate = new Date(year, nowMonth+1, 0);
	let fy = new Date(monthEndDate).getFullYear()
	let fm = new Date(monthEndDate).getMonth() + 1
	let fd = new Date(monthEndDate).getDate()
	return fy+'-'+(fm >= 10 ? fm : '0'+fm)+'-'+(fd >= 10 ? fd : '0'+fd)
}



module.exports = {
	getWeekStartDate:getWeekStartDate,
	getWeekEndDate:getWeekEndDate,
	getNowDay:getNowDay,
	getNowData:getNowData,
	getWeekDay:getWeekDay,
	monthStartDate:getMonthFirstDay,
	monthEndDate:getMonthLastDay
} 
