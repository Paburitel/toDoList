 
 var viewModel = function(){
 	var self = this;
 	this.task = ko.observableArray([]);

 	this.idCounter = 0;
 	this.isEdit = ko.observable(false);

 	this.genId = function() {
 		this.dataTask().id = "task_"+ this.idCounter++;
 	};

 	this.dataTask = ko.observable({
 		id: "",
 		event: "",
 		done: "",
 		day: "",
 		month:"",
 		year: ""
 	});

    /*показываем выбранное задание, находим в массиве task нужное по id,
    и клонируем в currentTask*/
 	this.editTask = function() {
 		this.refreshClass();
 		var elem = event.target,
	 		id = elem.closest("li").id,
	 		task, task1 = {};
 		if (elem.tagName.toLowerCase() !== ('button' && 'input')){
	 		
	 	
	 		task = this.task().filter(function(item , i , arr){
	 			return item.id == id;
	 		});

	 		for (key in task[0]) {
	 			task1[key] = task[0][key];
	 		};
	 		this.dataTask(task1);
			this.selectedMonth(task1.month);
			this.selectedYear(task1.year);
			this.isEdit(true);
 		};

 	}.bind(this);

 	/*создаем task, закидываем его в массив task*/
 	this.createTask = function() {
 		var namEvent, param = this.dataTask();

 		if(!this.dataTask().event) {
 			$("#taskTextBox").attr("class" , "has-error");
 		} else if (!this.dataTask().day || !this.dataTask().month || !this.dataTask().year){
 			$("#selectDate").attr("class" , "has-error");
 		} else if (this.dataTask().id){

 			this.task().filter(function(item , i , arr){
 				
	 			if (item.id == this.dataTask().id) {
	 				namEvent = i;
	 				return true;
	 			};
	 			
	 		});
	 		this.task().splice(namEvent , 1);
	 		this.task().splice(namEvent , 0 ,  new Task(param));
			this.task.sort(function (a, b) {
				return (a.fullDate == b.fullDate) ? 0 : ( (a.fullDate < b.fullDate) ? -1 : 1);
			});
	 		this.refreshTask();
			this.refreshClass();
			this.refreshDataTask();
			this.isEdit(false);


 		} else {
 			this.genId();
 			
	 		this.task.push( new Task(param));
			this.task.sort(function (a, b) {
				if (a.fullDate == b.fullDate) {return 0;};
				if (a.fullDate > b.fullDate) {return 1;};
				if (a.fullDate < b.fullDate) {return -1;};
			});
			this.refreshClass();
			this.refreshDataTask();
			this.isEdit(false);
			console.log(this.task());
	 	};

 	}.bind(this);

 	this.removeTask = function() {
 		self.task.remove(this);
 	};

	this.refreshClass = function(){
		 $("#selectDate").attr("class" , "");
		 $("#taskTextBox").attr("class" , "");
	 };


	this.refreshDataTask = function () {
	 	this.selectedMonth(null);
		 this.selectedYear(null);
		 this.dataTask({});
	 };

 	this.refreshTask = function(){
 		var task = this.task();
 		this.task([]);
 		this.task(task);
 	}.bind(this);


	this.selectedMonth = ko.observable();

	this.selectedMonth.subscribe(function (newValue) {

		self.dataTask().month = newValue;
		self.calendar(new GetCalendar(self.dataTask().month, self.dataTask().year));
	});

	this.selectedYear = ko.observable();

	this.selectedYear.subscribe(function (newValue) {
		 self.dataTask().year = newValue;
		 self.calendar(new GetCalendar(self.dataTask().month, self.dataTask().year));
	 });

 	this.calendar = ko.observable (new GetCalendar());
 };


 function Task(param){
 	var self = this;
 	self.id = param.id;
 	self.event = param.event;
 	self.done = param.done;
 	self.day = param.day;
 	self.month = param.month;
 	self.year = param.year;
 	self.date = self.day + "." + self.month + "." + self.year;
	self.fullDate = new Date(self.year, checkMonth(self.month), self.day);
 };

function GetCalendar(month, year){
				var i = j = 0, z = 3, g, part,
				daysTemp = [],
				days = [],
				allYear = [],
				calendar = {},
				amountAllDays = [], getMonth, getMonth,
				week = ['Mo','Tu','We','Th','Fr','Sa','Su'],
				monthName = ["January","February","March","April","May","June","July","August","September","October","November","December"];

				if (month) {
					getFullYear = (year)? year : new Date().getFullYear();
					calendar.month = month;
					getMonth = checkMonth(month);
					calendar.year = getFullYear;

				};
				if (year){
					getFullYear = year;

					if (month) {
						getMonth = checkMonth(month);
					} else {
						getMonth =  new Date().getMonth();
					};

					calendar.year = year;
				};


				if(!month && !year){
					getFullYear = new Date().getFullYear();
					month = getMonth = new Date().getMonth();
					calendar.month = monthName[month];
					calendar.year = getFullYear;
				};
				

				amountDays = new Date(getFullYear, getMonth+1 , 0).getDate(),
				// day = new Date().getDay(),
				day = prevDay().day;

				if (day !=7) {
					while (day--) {
						daysTemp.push("");
					};
				};

				while (i++ < amountDays) {
					daysTemp.push(i+"");
				};

				while (daysTemp.length) {
					part = daysTemp.splice(0,7);
					
					if (part.length < 7) {
						for (g = 7 - part.length ; g-- ;) {
							part.push("");
						};
					};
				days.push(part);	
				};

				for (j = 1 ; j <= amountDays ; j++) {
					amountAllDays.push(j);
				};

				allYear.push(new Date().getFullYear());
				var years = new Date().getFullYear();
				while (z--) {
					years+= 1;
					allYear.push(years);

				}
				days.unshift(week);
				calendar.days = days;
				calendar.amountDays = amountAllDays;
				calendar.monthName = monthName;
				calendar.years = allYear;
				return calendar;


			 	function prevDay(){

				var date = new Date(getFullYear, getMonth, 0),
				day = date.getDay(),
				prevDays = date.getDate(),
				prevDay = {};

				if (day === 0) {
					day = 7;
				};

				prevDay.day = day;
				prevDay.prevDays = prevDays;
				return prevDay;
				}
		};

 function checkMonth(month) {
	 var numMonth, monthName = ["January","February","March","April","May","June","July","August","September","October","November","December"];
	 monthName.filter(function (item, i) {
		 if (item == month) {
			 return numMonth = i;

		 }
	 });

	 return numMonth;
 }

ko.applyBindings(viewModel);