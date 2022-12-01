function checkPhone(value) {
	// var myreg=/^[1][3,4,5,6,7,8,9][0-9]{9}$/;
	var myreg=/^[0-9|\+]*$/
	if (!myreg.test(value)) {
		return false;
	} else {
		return true;
	}
}

function checkCNphone(value) {
	var myreg=/^[1][3,4,5,6,7,8,9][0-9]{9}$/;
	if (!myreg.test(value)) {
		return false;
	} else {
		return true;
	}
}

function getCurrentMonthDay(year, month) {
  var flag = year % 400 == 0 || (year % 4 == 0 && year % 100 != 0)
  var startDay = '01'
  var endDay = null
  switch (month) {
    case '01':
    case '03':
    case '05':
    case '07':
    case '08':
    case '10':
    case '12':
      endDay = 31
      break;
    case '04':
    case '06':
    case '09':
    case '11':
      endDay = 30
      break;
    case '02':
      endDay = flag ? 29 : 28
      break;
    default:
      endDay = '月份格式不正确，请重新输入！'
  }
  return {
	  startTime: year+'-'+month+'-'+startDay,
	  endTime: year+'-'+month+'-'+endDay
  }
}

//获取 本周对应的日期
function makeDate() {
	var date = new Date();
	var month = date.getMonth();
	var week = date.getDay();
	var month = month + 1;
	var day = date.getDate();
	let nowtime = date.getTime()
	let daytime = 24*60*60*1000
	//周日 0  周一 1  周二 2 周三 3  周四 4  周五 5   周六 6
	let arr = [{id:0,name:'日'},{id:1,name:'一'},{id:2,name:'二'},{id:3,name:'三'},{id:4,name:'四'},{id:5,name:'五'},{id:6,name:'六'}];
	// week：周几，day：几号
	var weekArr = [
		{week:'',day:'',date:''},
		{week:'',day:'',date:''},
		{week:'',day:'',date:''},
		{week:'',day:'',date:''},
		{week:'',day:'',date:''},
		{week:'',day:'',date:''},
		{week:'',day:'',date:''},
		];
	arr.forEach((ele,index)=>{
		let num = Math.abs(ele.id - week)
		let time = 0
		if(ele.id < week) {
			time = nowtime - daytime*num
		}else{
			time = nowtime + daytime*num
		}
		let date = handleTime(time)[0]
		weekArr[index].week = ele.name
		weekArr[index].day = date
		weekArr[index].date = handleTime(time)[1]
	})
	return weekArr
}
function withData(param) {
  return param < 10 ? '0' + param : '' + param;
}
function handleTime(date) {
	let time = new Date(date)
	let year = time.getFullYear()
	var month = time.getMonth()+1;
	month = withData(month)
	let day = time.getDate()
	let str = year+'-'+month+'-'+withData(day)
	return [day,str]
}

function getNowTime() {
	let t = new Date()
	let y = t.getFullYear()
	let m = withData(t.getMonth()+1)
	let d = withData(t.getDate())
	return y+'-'+m+'-'+d
}

function checkStartEnd(start,end) {
	let startTime = new Date(start).getTime()
	let endTime = new Date(end).getTime()
	if(endTime < startTime){
		return false
	}
	return true
}


module.exports = {
	checkPhone:checkPhone,
	makeDate:makeDate,
	getNowTime:getNowTime,
	checkStartEnd:checkStartEnd,
	checkCNphone:checkCNphone,
	getCurrentMonthDay:getCurrentMonthDay
}