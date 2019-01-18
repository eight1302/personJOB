/** 
 * create author name xiaominzhang
 * create time 2018/8/19
*/
var vue = new Vue({
  el:"#app",
  mounted(){
      //默认在浏览器创建客户表且获取表的信息
      this.createuser(); //创建用户表
  },
  data:{
    form:{
        typeId:''
    },
    db : openDatabase('mydb', '1.0', 'Test DB', 2 * 1024 * 1024),
    input: '',
    userdata:{
      user : '',
      pass : ''
    },
    rules: {//必填项提示
      user: [{required: true, message: '账号不能为空', trigger: 'blur'}],
      pass : [{required: true, message: '密码不能为空', trigger: 'blur'}]
    },
    getsuccess : '',
    users : [],    //用户信息
    maxid : '',   //最大id
    userall : [], //所有用户
    width : {width:'90%'} //筛选条件的宽度
  },
  methods:{
    //创建客户信息
    createuser : function(){
      var data = {
        user : "admin",
        pass : "123456",
        time : 1547019104360
      }
      this.db.transaction(function (tx) {
         tx.executeSql('CREATE TABLE IF NOT EXISTS userData (id,user,pass,time)');
         tx.executeSql('CREATE TABLE IF NOT EXISTS log (username,name,state,time)');
         tx.executeSql('CREATE TABLE IF NOT EXISTS folowdata (id,clientname,callbackway,planname,contactname,user,callbackdate,noticetime,status,info,time)');
         tx.executeSql('CREATE TABLE IF NOT EXISTS clientdata (id,user,name,contactsname,contactstel,importance,province,city,district,address)');
         //判断数据中是否存在用户名，密码
         tx.executeSql('SELECT * FROM userData', [], function (tx, results) {
          if(results.rows.length<=0){
            tx.executeSql('INSERT INTO userData (id,user,pass,time) VALUES (?,?,?,?)', [1,data.user,data.pass,data.time]);
          }
        }, null);
      });
    },

    //日期格式转换
    dateFormat:function(row, column) { 
      var date = row[column.property]; 
      if (date == undefined) { 
        return ""; 
      } 
      return moment(date.time).format("YYYY-MM-DD HH:mm"); 
    },

    //客户信息处理
    primse : function(){
      this.db.transaction(function (tx) {
        //查询所有用户信息
        tx.executeSql('SELECT * FROM userData', [], function (tx, results) {
          vue.userall = results.rows;
          vue.maxid = vue.userall[vue.userall.length-1].id+1;
        }, null);
      });
      var user = this.userdata.user,
          pass = this.userdata.pass;
      var time = new Date().getTime();
      //获取当前时间戳
      var data = {
        user : user,
        pass : pass,
        time : time
      };
      //判断密码，账号不为空
      if(user!='' && pass!=''){
        return data;
      }else{
        //判断密码
        if(pass == ''){
          this.$message({
            message: '请输入密码信息',
            type: 'warning'
          });
        }
        //判断账号
        if(user == ''){
          this.$message({
            message: '请输入账号信息',
            type: 'warning'
          });
        }
        return false;
      }
    },
    //登录
    onSubmit : function(){
      var data = this.primse();
      //判断flag不为false,登录。
      if(data!=false){
        //获取用户列表数据
          this.db.transaction(function (tx) {
            //判断数据中是否存在用户名，密码
            tx.executeSql('SELECT * FROM userData where user="'+data.user+'" and pass="'+data.pass+'"', [], function (tx, results) {
            //判断登录是否成功
            if(results.rows.length == 0){
              tx.executeSql('INSERT INTO userData (id,user,pass,time) VALUES (?,?,?,?)', [vue.maxid,data.user,data.pass,data.time]);
              tx.executeSql('INSERT INTO log (username,name,state,time) VALUES (?,?,?,?)', [data.user,"会员注册","注册成功",data.time]);
              vue.$message({
                message: '登录成功',
                type: 'success'
              });
              localStorage.setItem("user",data.user);
              window.location.href = '../view/home/home.html';
            }else{
              tx.executeSql('INSERT INTO log (username,name,state,time) VALUES (?,?,?,?)', [data.user,"会员登录","登录成功",data.time]);
              vue.$message({
                message: '登录成功',
                type: 'success'
              });
              localStorage.setItem("user",data.user);
              window.location.href = '../view/home/home.html'; 
            }
            
          }, null);
        });
      }
    }
  }
});