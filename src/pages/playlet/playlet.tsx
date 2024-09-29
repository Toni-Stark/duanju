import { useDidShow ,useReady ,useLoad} from "@tarojs/taro";
// @ts-ignore
const { PlayletExtension ,getPlayletManager} = tt;

export default  PlayletExtension(()=>{
  const pm = getPlayletManager();
  useLoad((res)=>{
    console.log('页面完成Load pm options', pm,res);
  });
  useReady(()=>{
    console.log(pm,'pm ready')
  });
  useDidShow(() => {
    console.log("show");
  });
});
