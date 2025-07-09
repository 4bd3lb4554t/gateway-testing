

export async function sendToService( url: string, method: string , id:any = null , body: any = null): Promise<object> 
{

  const options:any = {
    method: method,
    headers: {
      'id': (!id ? '' : id),
    },
  };

  if (body != null && ['POST', 'PUT', 'PATCH'].includes(method.toUpperCase()))
  {
    options.headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(body);
  }

  const res = await fetch(url, options);
  return (await res.json());
}


