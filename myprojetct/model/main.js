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
    sale : { //销售趋势时间段
        saledata1 : '',
        saledata2 : '',
        company : 'R01',
        brand : 'all',
        dimension : '100000.110',
        type : '11',
        list : ['index33','index16','index36','index37']
    },
    saleAnalysis : { //销售趋势分析

    },
    section : {//部门月销售数据分析
        target : '',
        accomplish : '',
        finishingRate : '',
        clientSale : '',
        lossSale : ''
    }, 
    clientTime : { //客户趋势时间
        saledata1 : '',
        saledata2 : '',
        company : 'R01',
        brand : 'all',
        dimension : '100000.110',
        type : '11',
        list : ['index1','index2','index7','index8','index3','index4','index5']
    },
    cusdatafx : {  //客户数据分析
        time : '',
        company : 'R01',
        brand : 'all',
        conditions : 'all',
        dimension : '100000.110',
        type : '11',
        list : ['index1','index2','index7','index8','index3','index4','index5']
    },
    clienData :{
        data : {
            after : '',
            news : '',
            before : '',
        },
        datadetail : [],
        series :[],
    },
    funnelld : { //漏斗图
        detail : [],
        series : []
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
        var data = [{region:"北京",value:15000},{region:"上海",value:13000},{region:"深圳",value:11000},{region:"广州",value:10000},{region:"杭州",value:11200},{region:"成都",value:10000},{region:"西安",value:9000},{region:"郑州",value:9800}];
        this.db.transaction(function (tx) {
            tx.executeSql('CREATE TABLE IF NOT EXISTS region (name,value)');
            tx.executeSql('SELECT * FROM region', [], function (tx, results) {
                length = results.rows.length;
                if(length<=0){
                    for(var i=0;i<data.length;i++){
                        tx.executeSql('INSERT INTO region (name,value) VALUES (?,?)',[data[i].region,data[i].value]);
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
            tx.executeSql('SELECT * FROM region', [], function (tx, results) {
                length = results.rows.length;
               if(length<0){
                    tx.executeSql('CREATE TABLE IF NOT EXISTS jonbl (jobnumber,value)');
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


      //部门销售数据分析
      departmentSale : function(url){
          //请求数据
         
      },

      //获取销售趋势分析的数据
      saleTrand:function(url){
         
      },

      //销售趋势分析数据处理
      saleTrandEcharts : function(timeData,datashow){
          //this.clientTime
          var data1 = new Array(), //目标销售额
              data2 = new Array(), //完成销售额
              data3 = new Array(), //完成率
              data4 = new Array(), //新增客户销售额
              data5 = new Array(); //流水客户半年月均销售额
          for(let i=0;i<datashow.length;i++){
              for(let j=0;j<timeData.length;j++){
                  if(timeData[j] == datashow[i].data_date){
                      data1.push({'time':timeData[j],value:datashow[i].index33?Number(datashow[i].index33):0}); //目标销售额
                      data2.push({'time':timeData[j],value:datashow[i].index16?Number(datashow[i].index16):0}); //完成销售额
                      data3.push({'time':timeData[j],value:(((datashow[i].index16?Number(datashow[i].index16):0)/(datashow[i].index33?Number(datashow[i].index33):0))*100).toFixed(2)}); //完成率 
                      data4.push({'time':timeData[j],value:datashow[i].index36?Number(datashow[i].index36):0}); //新增客户销售额
                      data5.push({'time':timeData[j],value:datashow[i].index37?Number(datashow[i].index37).toFixed(2):0}); //流水客户半年月均销售额

                  }else{
                      data1.push({'time':timeData[j],value:0});
                      data2.push({'time':timeData[j],value:0});
                      data3.push({'time':timeData[j],value:0}); 
                      data4.push({'time':timeData[j],value:0});
                      data5.push({'time':timeData[j],value:0});  
                  }
              }
          }

          this.saleAnalysis.series = [
              {
                  name:'完成率',
                  type:'line',
                  stack: '',
                  yAxisIndex: 1,
                  data:this.heavy1(data3,timeData),
                  itemStyle: {
                      normal: {
                          label: {
                              show: true,
                              positiong: 'top',
                              formatter: '{c}%'
                          }
                      }
                  }
              },{
                  name:'目标销售额',
                  type:'line',
                  stack: '',
                  data:this.heavy1(data1,timeData),
              },
              {
                  name:'完成销售额',
                  type:'line',
                  stack: '',
                  data:this.heavy1(data2,timeData)
              },
              {
                  name:'新增客户销售额',
                  type:'line',
                  stack: '',
                  data:this.heavy1(data4,timeData)
              },
              {
                  name:'流失客户半年月均销售额',
                  type:'line',
                  stack: '',
                  data:this.heavy1(data5,timeData)
              }
          ];
          //销售趋势分析折线图
          this.fxtrend();
       
      },


      //销售趋势分析折线图
      fxtrend:function(){
        var mychartsale= echarts.init(document.getElementById('mychartsale'));
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
                    boundaryGap : false,
                    data : this.saleAnalysis.month
                }
            ],
            yAxis : [
                {
                    name: '金额',
                    type : 'value',
                    scale:true,
                },{
                    name: '完成率',
                    type: 'value',
                    scale:true,
                    min: 0,
                    max: 100,        // 计算最大值
                    interval: Math.ceil(100 / 5),   //  平均分为5份
                    axisLabel: {  
                        show: true,    
                        formatter: '{value} %'  
                    }
                    
                }
            ],
            series : this.saleAnalysis.series
        };        

        // 使用刚指定的配置项和数据显示图表。
        mychartsale.setOption(option);
        window.addEventListener("resize",function(){
            mychartsale.resize(); 
        });
      },

      /**
       * 客户趋势分析请求接口数据整合
       *  请求后台接口 
      */
      custrend:function (url) {
         
      },

       //调用客户趋势展示的方法
      ClientEcharts : function(timeData,datashow){
           //this.clientTime
          var data1 = new Array(), //客户总数
              data2 = new Array(), //新增客户
              data3 = new Array(), //近3月成交客户数
              data4 = new Array(), //近6月成交客户数
              data5 = new Array(), //近12月成交客户数
              data6 = new Array(), //跟进客户
              data7 = new Array(); //跟进次数
          for(let i=0;i<datashow.length;i++){
              for(let j=0;j<timeData.length;j++){
                  if(timeData[j] == datashow[i].data_date){
                      data1.push({'time':timeData[j],value:datashow[i].index1?datashow[i].index1:0}); //客户总数
                      data2.push({'time':timeData[j],value:datashow[i].index2?datashow[i].index2:0}); //新增客户
                      data3.push({'time':timeData[j],value:datashow[i].index3?datashow[i].index3:0}); //近3月成交客户数
                      data4.push({'time':timeData[j],value:datashow[i].index4?datashow[i].index4:0}); //近6月成交客户数
                      data5.push({'time':timeData[j],value:datashow[i].index5?datashow[i].index5:0}); //近12月成交客户数
                      data6.push({'time':timeData[j],value:datashow[i].index7?datashow[i].index7:0}); //跟进客户
                      data7.push({'time':timeData[j],value:datashow[i].index8?datashow[i].index8:0}); //跟进次数

                  }else{
                      data1.push({'time':timeData[j],value:0});
                      data2.push({'time':timeData[j],value:0});
                      data3.push({'time':timeData[j],value:0});
                      data4.push({'time':timeData[j],value:0});
                      data5.push({'time':timeData[j],value:0});
                      data6.push({'time':timeData[j],value:0});
                      data7.push({'time':timeData[j],value:0});
                  }
              }
          }
          this.custrand.series =  [
              {
                  name:'客户总数',
                  type:'line',
                  stack: '',
                  data: this.heavy1(data1,timeData)
              },{
                  name:'新增客户',
                  type:'line',
                  stack: '',
                  data:this.heavy1(data2,timeData)
              },
              {
                  name:'近3月成交客户数',
                  type:'line',
                  stack: '',
                  data:this.heavy1(data3,timeData)
              },
              {
                  name:'近6月成交客户数',
                  type:'line',
                  stack: '',
                  data: this.heavy1(data4,timeData)
              },
              {
                  name:'近12月成交客户数',
                  type:'line',
                  stack: '',
                  data: this.heavy1(data5,timeData)
              },
              {
                  name:'跟进客户',
                  type:'line',
                  stack: '',
                  data: this.heavy1(data6,timeData)
              },
              {
                  name:'跟进次数',
                  type:'line',
                  stack: '',
                  data:this.heavy1(data7,timeData)
              }
          ];
          //客户折线图展示
          this.customertrend();
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