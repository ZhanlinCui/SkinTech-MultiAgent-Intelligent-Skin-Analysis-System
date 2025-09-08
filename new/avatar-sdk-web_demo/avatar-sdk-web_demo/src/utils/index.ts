import { md5 } from 'js-md5'
export const getToken = async (appId: string, appKey: string) => {
  const timeStamp = `${Date.now()}`
  let data = `{"base":{"appid":"${appId}","version":"v1","timestamp":"${timeStamp}"},"model":"remote"}`

  const sign = md5(md5(`${appKey}${timeStamp}`) + data)
  const auth = await fetch(`/aiauth/v1/token`, {
    method: 'post',

    body: JSON.stringify({
      base: {
        appid: appId,
        version: 'v1',
        timestamp: timeStamp,
      },
      model: 'remote',
    }),
    headers: {
      'Content-Type': 'application/json',
      Authorization: sign,
    },
  }).then((resp) => resp.json())

  return {
    code: auth?.retcode,
    message: auth?.msg,
    accesstoken: auth?.accesstoken,
  }
}
