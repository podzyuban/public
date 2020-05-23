import http from 'k6/http';
import { check } from 'k6';


export let options = { 
maxRedirects: 4,
duration: '30m',
rps: 20,
 };

function testGetUser(id, expectedName, url){
	let urlpath = url+`/`+id;
	
  let getUserResponse = http.get(urlpath);
    
  check(getUserResponse, {
	  'status is 200': (z)=>z.status ===200,
	  'name is corrent':(z)=>JSON.parse(z.body)['name']===expectedName
  });

}

export default function() {

	console.log('__ENV.APPHOST:'+${__ENV.APPHOST});
	const url = ${__ENV.APPHOST}+'/user';
	const userName = 'sameUserName';

	
  let createUser = JSON.stringify({name: userName});

  let params = {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'accept': 'text/plain',
	  'Accept-Encoding':'gzip, deflate, br',
	  'Connection':'keep-alive',
	  'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36'
    },
  };
  
  let createResponse = http.post(url, createUser, params);
  
  check(createResponse, {"status is 200": (z)=>z.status ===200});
  
  
  let userId = JSON.parse(createResponse.body)['id']
  
  testGetUser(userId, userName, url);
  
  let userIdPath = url+`/`+userId;
  
  let nextUserName = userName+'next';
  
  let updateUser = JSON.stringify({id: userId, name: nextUserName});
  
  let updateUserResponse = http.put(userIdPath, updateUser, params);
  
  check(updateUserResponse, {'status is 200': (z)=>z.status ===204});
 
  testGetUser(userId, nextUserName, url);
 
  
  let deleteParams =  {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'accept': '*/*',
	  'Accept-Encoding':'gzip, deflate, br',
	  'Connection':'keep-alive',
	  'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36'
	  }};

	let deleteResponse = http.del(userIdPath, deleteParams);
	
	check(deleteResponse,{'status is 204': (z)=>z.status === 204});
	
	let failedGetUserResponse = http.get(userIdPath, params);
	
	check(failedGetUserResponse,{'status is 500': (z)=>z.status === 500});
  }

