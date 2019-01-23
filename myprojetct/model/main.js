/** 
 * create author name xiaominzhang
 * create time 2018/10/11
*/
var vue = new Vue({
  el:"#app",
  mounted(){
      this.pushregion();   //默认保存地域相关数据
      this.getregion();    //获取数据
      this.joinJob();      //就业比例
      this.saleComent();
      this.custrend();     //客户数据分析
  },
  data:{
    form:{
        typeId:''
    },
    input: '',
    db : openDatabase('mydb', '1.0', 'Test DB', 2 * 1024 * 1024),
    isHide : true,              //加载时展示，成功隐藏
    regiondata : [],
    smsdialog : false,
    formLabelWidth: '120px',
    regionadds : {              //销售数据参数请求
       name : '',
       value : ''
    },   
    custrand : {                //客户趋势分析
        detail : [],
        time : [],
        series : [],
    },
    saleAnalysis : { //销售趋势分析

    },

    clienData :{
        data : {
            after : '',
            news : '',
            before : ''
        },
        name : [],
        index1 : [],
        index2 :[],
        index3 :[],
    },
    width_home:''
  },
  created : function(){
    this.ww();
    const that = this
    window.onresize = () => {
        return (() => {
        this.ww();
        })();
    }
  },
  methods:{
    //请求页面宽度
    ww(){
        this.width_home = window.innerWidth;
    },

    //默认保存区域数据
    pushregion : function(){
        var length = 0;
        var data = [{id:1,region:"北京",value:15000},{id:2,region:"上海",value:13000},{id:3,region:"深圳",value:11000},{id:4,region:"广州",value:10000},{id:5,region:"杭州",value:11200},{id:6,region:"成都",value:10000},{id:7,region:"西安",value:9000},{id:8,region:"郑州",value:9800}];
        this.db.transaction(function (tx) {
            tx.executeSql('CREATE TABLE IF NOT EXISTS region (id,name,value)');
            tx.executeSql('SELECT * FROM region', [], function (tx, results) {
                length = results.rows.length;
                if(length<=0){
                    for(var i=0;i<data.length;i++){
                        tx.executeSql('INSERT INTO region (id,name,value) VALUES (?,?,?)',[data[i].id,data[i].region,data[i].value]);
                    }
                }
            }, null);
         });
    },

    /**
     * 获取地域数据
     */
    getregion : function(){
      
        this.regiondata.length = 0;
        this.db.transaction(function (tx) {
            //添加区域薪资数据
            tx.executeSql('SELECT * FROM region', [], function (tx, results) {
                vue.regiondata = results.rows;
                vue.dealregion();
               
            }, null);
        });
        
    },

    //数据处理地域数据
    dealregion : function(){
        var name = new Array(),value = new Array();
        for(var i=0;i<this.regiondata.length;i++){
            name.push(this.regiondata[i].name);
            value.push(this.regiondata[i].value);
        }
        this.fxdashboard2(name,value);
    },

    //地域薪资展示
    fxdashboard2 : function(name,value){
        var fxdashboard2 = echarts.init(document.getElementById('fxdashboard2'));
        // 指定图表的配置项和数据
        option = {
            tooltip : {
                trigger: 'axis'
            },
            legend: {
              y : 'bottom',
                data:this.saleAnalysis.amount
            },
            toolbox: {
                show : true,
                feature : {
                    mark : {show: true},
                    dataView : {show: true, readOnly: false},
                    magicType : {show: true, type: ['line', 'bar', 'stack', 'tiled']},
                    restore : {show: true},
                    saveAsImage : {show: true}
                }
            },
            calculable : true,
            xAxis : [
                {
                    type : 'category',
                    boundaryGap : true,
                    data : name
                }
            ],
            yAxis : [
                {
                    name: '薪资',
                    type : 'value',
                    scale:true,
                }
            ],
            series : [
                {
                    name:'人均薪资',
                    type:'bar',
                    barWidth : 30,//柱图宽度
                    data:value
                }
            ]
        };      
        // 使用刚指定的配置项和数据显示图表。
        fxdashboard2.setOption(option);
        window.addEventListener("resize",function(){
            fxdashboard2.resize(); 
        });
    },

    //新增地域信息
    addregion : function(){
        this.smsdialog = true;
    },

    //提交数据
    smsbtn : function(){
        var username = localStorage.getItem("user");
        this.db.transaction(function (tx) {
            tx.executeSql('CREATE TABLE IF NOT EXISTS region (name,value)');
            tx.executeSql('INSERT INTO region (name,value) VALUES (?,?)',[vue.regionadds.name,vue.regionadds.value]);
            tx.executeSql('INSERT INTO log (username,name,state,time) VALUES (?,?,?,?)', [username,"添加"+vue.regionadds.name+"地域平均薪资为"+vue.regionadds.value,"添加成功",Date.parse(new Date())]);
            vue.smsdialog = false;
            vue.getregion();
        });
    },

     //就业数据处理
     joinJob : function(){
        var length = 0;
        this.db.transaction(function (tx) {
            tx.executeSql('CREATE TABLE IF NOT EXISTS jonbl (jobnumber,value)');
            tx.executeSql('SELECT * FROM jonbl', [], function (tx, results) {
                length = results.rows.length;
               if(length<=0){
                    tx.executeSql('INSERT INTO jonbl (jobnumber,value) VALUES (?,?)',["after",15000]);
                    tx.executeSql('INSERT INTO jonbl (jobnumber,value) VALUES (?,?)',["news",8000]);
                    tx.executeSql('INSERT INTO jonbl (jobnumber,value) VALUES (?,?)',["before",30000]);
               }
               vue.getJob();
            }, null);
        });
    },

    //获取就业数据
    getJob : function(){
        this.db.transaction(function (tx) {
            //添加区域薪资数据
            tx.executeSql('SELECT * FROM jonbl', [], function (tx, results) {
                vue.dealJob(results.rows);
            }, null);
        });
    },

    //处理就业数据
    dealJob : function(data){
        var allNum = 0;
       for(var i=0;i<data.length;i++){
            allNum+=data[i].value;
       }
        this.clienData.data.after = (data[0].value/allNum).toFixed(2);
        this.clienData.data.news = (data[1].value/allNum).toFixed(2);
        this.clienData.data.before = (data[2].value/allNum).toFixed(2);
    },

    //薪资分布趋势
    saleComent : function(){
        var length = 0;
        var data = [
            {name:"3k以下",index1:7500,index2:1200,index3:0},
            {name:"3k-5k",index1:800,index2:6500,index3:1000},
            {name:"5k-9k",index1:400,index2:11200,index3:6000},
            {name:"9k-14k",index1:100,index2:600,index3:13500},
            {name:"14k以上",index1:0,index2:0,index3:8000}
        ];
        this.db.transaction(function (tx) {
            //index1在校,index2刚毕业,index3，毕业1年以上
            tx.executeSql('CREATE TABLE IF NOT EXISTS saleComent (name,index1,index2,index3)'); 
            tx.executeSql('SELECT * FROM saleComent', [], function (tx, results) {
                length = results.rows.length;
                if(length<=0){
                    for(var i=0;i<data.length;i++){
                    tx.executeSql('INSERT INTO saleComent (name,index1,index2,index3) VALUES (?,?,?,?)',[data[i].name,data[i].index1,data[i].index2,data[i].index3]);
                    }
                }
                vue.getComent();
            }, null);
        });
    },
  
    //获取数据
    getComent : function(){
        this.db.transaction(function (tx) {
            //添加区域薪资数据
            tx.executeSql('SELECT * FROM saleComent', [], function (tx, results) {
                vue.dealComent(results.rows);
            }, null);
        });
    },

    //处理薪资范围
    dealComent : function(data){
        this.clienData.name.length = 0;
        this.clienData.index1.length = 0;
        this.clienData.index2.length = 0;
        this.clienData.index3.length = 0;
        for(var i=0;i<data.length;i++){
            this.clienData.name.push(data[i].name);
            this.clienData.index1.push(data[i].index1);
            this.clienData.index2.push(data[i].index2);
            this.clienData.index3.push(data[i].index3);
        }
        this.saleTrandEcharts();
    },


    //销售趋势分析数据处理
    saleTrandEcharts : function(){
        var series = [
            {
                name:'实习生',
                type:'line',
                stack: '',
                data:this.clienData.index1
            },
            {
                name:'应届生',
                type:'line',
                stack: '',
                data:this.clienData.index2
            },
            {
                name:'社会人员',
                type:'line',
                stack: '',
                data:this.clienData.index3
            }
        ];
        //销售趋势分析折线图
        this.fxtrend(series);
        
    },


    //销售趋势分析折线图
    fxtrend:function(series){
        var mychartcus= echarts.init(document.getElementById('mychartcus'));
        // 指定图表的配置项和数据
        option = {
            tooltip : {
                trigger: 'axis'
            },
            legend: {
            y : 'bottom',
                data:["实习生","应届生","社会人员"]
            },
            toolbox: {
                show : true,
                feature : {
                    mark : {show: true},
                    dataView : {show: true, readOnly: false},
                    magicType : {show: true, type: ['line', 'bar', 'stack', 'tiled']},
                    restore : {show: true},
                    saveAsImage : {show: true}
                }
            },
            calculable : true,
            xAxis : [
                {
                    type : 'category',
                    boundaryGap : false,
                    data : this.clienData.name
                }
            ],
            yAxis : [
                {
                    name: '金额',
                    type : 'value',
                    scale:true,
                }
            ],
            series : series
        };        

        // 使用刚指定的配置项和数据显示图表。
        mychartcus.setOption(option);
        window.addEventListener("resize",function(){
            mychartcus.resize(); 
        });
    },

    //获取当前月当前日期以及开始日期的数据
    getMonthAll : function() {
        var myDate = new Date();
        //获取当前年
        var year=myDate.getFullYear();
        //获取当前月
        var month=myDate.getMonth()+1;
        var current = myDate.getDate();
        var dateArry = new Array();
        for(var i=1;i<=current;i++){
            dateArry.push(year+'-'+(month>9?month:'0')+month+'-'+(i>9?i:'0'+i));
        }
        return dateArry;
    },

      /**
       * 客户趋势分析请求接口数据整合
       *  请求后台接口 
      */
      custrend:function () {
        this.custrand.detail = ['客户总数'];
        this.custrand.time = this.getMonthAll();
        this.ClientEcharts(this.custrand.time);
      },

       timeFormat : function(timestamp){
        //timestamp是整数，否则要parseInt转换,不会出现少个0的情况
          var time = new Date(timestamp);
          var year = time.getFullYear();
          var month = time.getMonth()+1;
          var date = time.getDate();
          return year+'-'+(month>9?month:'0'+month)+'-'+(date>9?date:'0'+date);
        },

       //调用客户趋势展示的方法
      ClientEcharts : function(timeData){

           //this.clientTime
        var data1 = new Array(); //客户总数
        for(let j=0;j<timeData.length;j++){
            this.db.transaction(function (tx) {
                tx.executeSql('SELECT * FROM clientdata where time='+"'"+timeData[j]+"'", [], function (tx, results) {
                    console.log(results.rows.length);
                    data1.push(results.rows.length);
                    vue.customertrend();
                }, null);
            });
        }
        console.log(data1);
          this.custrand.series =  [
              {
                  name:'客户总数',
                  type:'line',
                  stack: '',
                  data: data1
              }
          ];
      },


      //客户趋势分析
      customertrend:function(){
          var mychartcustomer= echarts.init(document.getElementById('mychartcustomer'));
          // 指定图表的配置项和数据
          option = {
              tooltip : {
                  trigger: 'axis'
              },
              legend: {
                  y : 'bottom',
                  data:this.custrand.detail
              },
              toolbox: {
                  show : true,
                  feature : {
                      mark : {show: true},
                      dataView : {show: true, readOnly: false},
                      magicType : {show: true, type: ['line', 'bar', 'stack', 'tiled']},
                      restore : {show: true},
                      saveAsImage : {show: true}
                  }
              },
              calculable : true,
              xAxis : [
                  {
                      type : 'category',
                      boundaryGap : false,
                      data : this.custrand.time
                  }
              ],
              yAxis : [
                  {
                      name: '数量',
                      type : 'value',
                      scale:true,
                  }
              ],
              series : this.custrand.series
          };        

          // 使用刚指定的配置项和数据显示图表。
          mychartcustomer.setOption(option);
          window.addEventListener("resize",function(){
              mychartcustomer.resize(); 
          });
      }
  }
});