// pages/home/home.js
import request from '../../service/network.js'

const TOP_DISTANCE="1000"
const types=['pop','new','sell']
Page({

  data: {
    banners:[],
    recommends:[],
    titles:['流行','新款','精选'],
    goods:{
      'pop':{page:0,list:[]},
      'new':{page:0,list:[]},
      'sell':{page:0,list:[]}
    },
    currentType:'pop',
    showBackTop:false
  },
  onLoad: function (options) {
      // 1.请求轮播图以及推荐数据
      this._luobnRequest()
      //2. 请求推荐的数据
      this._tuijianRequest('pop')
      this._tuijianRequest('new')
      this._tuijianRequest('sell')
  },
 
  _luobnRequest(){
    request({
      url:'http://123.207.32.32:8000/api/h8/home/multidata'
    }).then(res=>{
      // console.log(res);
      this.setData({
        banners: res.data.data.banner.list,
        recommends:res.data.data.recommend.list
      })   
    })
  },
  _tuijianRequest(type){
    // 1. 获取页码
    const page=this.data.goods[type].page+1;

    // 2. 发送网络请求
       request({
        url:'http://123.207.32.32:8000/api/h8/home/data',
        data:{
          type:type,
          page:page
        }
      }).then(res=>{
        // console.log(res);

        // 2.1. 取出数据
        const list=res.data.data.list
    
        // 2.2.将数据设置到对应type的list中
        const oldList = this.data.goods[type].list;
        oldList.push(...list)

        // 2.3.将数据设置到data中的goods中
        const typeKey = `goods.${type}.list`;
        const pageKey = `goods.${type}.page`;
        this.setData({
          [typeKey]: oldList,
          [pageKey]: page
        })
       
      })
  },
  handleTabClick(event){
    // 取出index
    const index=event.detail.index;
    // console.log(index);
    
    // 设置currentType
    this.setData({
      currentType:types[index]
    })
    
  },

  onReachBottom(){
    // 上拉加载更多
    this._tuijianRequest(this.data.currentType)
    
  },
  onPageScroll(options){
    // 1. 取出scrollTop
    const scrollTop=options.scrollTop;
    // 2. 修改showBackTop属性
    const flag=scrollTop >= TOP_DISTANCE;
    if(flag!=this.data.showBackTop){
      this.setData({
        showBackTop:flag
      })
    }
    
  }


})