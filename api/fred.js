// 代抓 FRED 官方數據。金鑰放在 Vercel 環境變數 FRED_API_KEY，不會出現在網頁裡。
const SERIES = {cpi:"CPIAUCSL",ppi:"PPIFIS",unrate:"UNRATE",unemp:"UNEMPLOY",y1:"DGS1",y10:"DGS10",y30:"DGS30"};
async function one(id){
  try{
    const u = "https://api.stlouisfed.org/fred/series/observations?series_id="+id+"&api_key="+process.env.FRED_API_KEY+"&file_type=json&sort_order=desc&limit=18";
    const j = await (await fetch(u)).json();
    return j.observations.filter(o=>o.value!==".").map(o=>({d:o.date,v:+o.value}));
  }catch(e){ return null; }
}
export default async function handler(req,res){
  const keys = Object.keys(SERIES);
  const vals = await Promise.all(keys.map(k=>one(SERIES[k])));
  res.setHeader("Cache-Control","s-maxage=600, stale-while-revalidate=3600");
  res.status(200).json(Object.fromEntries(keys.map((k,i)=>[k,vals[i]])));
}
