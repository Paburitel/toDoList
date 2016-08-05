 
 var viewModel = function(){
 	var self = this;
 	this.task = ko.observableArray([]);

 	this.idCounter = 0;
 	this.currentTask = ko.observable();

 	this.genId = function() {
 		this.dataTask().id = "task_"+ this.idCounter++;
 	};

 	this.dataTask = ko.observable({
 		id: "",
 		event: "",
 		done: "",
 		day: "",
 		month: "",
 		year: ""
 	});
 	this.isEdit = ko.observable(false);
 	this.isBlank = ko.observable(true);

 	this.showCreate = function(){
 		this.isBlank(true);
 	}.bind(this);

 	this.editTask = function(){
 		
 		for (key in this.currentTask()){
 			this.dataTask()[key] = this.currentTask()[key];
 		};
 		this.isBlank(true);

 	}.bind(this);
    /*показываем выбранное задание, находим в массиве task нужное по id,
    и клонируем в currentTask*/
 	this.showTask = function() {
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
	 		this.currentTask({});
	 		this.currentTask(task1);
	 		console.log(this.currentTask());
	 		this.isBlank(false);
 		};
 		console.log(this.task());
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
	 		console.log(namEvent);
	 		this.task().splice(namEvent , 1);
	 		this.task().splice(namEvent , 0 ,  new Task(param));
	 		this.refreshTask();
	 		// this.task.push( new Task(param));
	 		console.log(this.task());
	 		$("#selectDate").attr("class" , "");
	 		$("#taskTextBox").attr("class" , "");
	 		this.dataTask({});

 		} else {
 			this.genId();
 			
	 		this.task.push( new Task(param));
	 		$("#selectDate").attr("class" , "");
	 		$("#taskTextBox").attr("class" , "");
	 		this.dataTask({});
	 	};

	 	this.calendar(new GetCalendar(param.month, param.year));

 	}.bind(this);

 	this.removeTask = function() {
 		self.task.remove(this);
 		console.log(self.task());
 	};


 	this.refreshTask = function(){
 		var task = this.task();
 		this.task([]);
 		this.task(task);
 	}.bind(this);

 	this.selectDate = ko.observableArray([{
 		day:"",
 		month: "",
 		year: "",
 		event: ""
 	}]);

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

 };

function GetCalendar(month, year){
				var i = j = 0, z = 3, g, part,
				daysTemp = [],
				days = [],
				allYear = [],
				calendar = {},
				amountAllDays = [],
				week = ['Mo','Tu','We','Th','Fr','Sa','Su'],
				monthName = ["January","February","March","April","May","June","July","August","September","October","November","December"];

				if (month && year) {
				var getFullYear = year,

				getMonth;
				calendar.month = month;

				calendar.year = year;
				monthName.filter(function(item, i){
					if(item == month){
						getMonth = i;
						return
					}
				});

				} else {
				var getFullYear = new Date().getFullYear(),
				getMonth = new Date().getMonth();
				month = new Date().getMonth(),
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

ko.applyBindings(viewModel);