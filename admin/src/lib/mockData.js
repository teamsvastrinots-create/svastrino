export const STUDENTS=[
  {id: 1, name:'Rohan Kumar',phone:'+91 98765 43210',cls:'11th',status:'Premium',week:'8/24',pct:33,tasks:48,enrolled:'Apr 10, 2026'},
  {id: 2, name:'Priya Sharma',phone:'+91 87654 32109',cls:'12th',status:'Free',week:'2/24',pct:8,tasks:12,enrolled:'Apr 12, 2026'},
  {id: 3, name:'Arjun Verma',phone:'+91 76543 21098',cls:'10th',status:'Premium',week:'14/24',pct:58,tasks:84,enrolled:'Mar 28, 2026'},
  {id: 4, name:'Neha Das',phone:'+91 65432 10987',cls:'9th',status:'Free',week:'1/24',pct:4,tasks:6,enrolled:'Apr 13, 2026'},
  {id: 5, name:'Karan Singh',phone:'+91 54321 09876',cls:'11th',status:'Premium',week:'20/24',pct:83,tasks:120,enrolled:'Jan 5, 2026'},
  {id: 6, name:'Anjali Mehta',phone:'+91 43210 98765',cls:'12th',status:'Free',week:'5/24',pct:21,tasks:30,enrolled:'Mar 15, 2026'},
  {id: 7, name:'Vikram Nair',phone:'+91 32109 87654',cls:'10th',status:'Premium',week:'12/24',pct:50,tasks:72,enrolled:'Feb 20, 2026'},
  {id: 8, name:'Sonal Patel',phone:'+91 21098 76543',cls:'8th',status:'Free',week:'3/24',pct:12,tasks:18,enrolled:'Apr 1, 2026'},
];

export const WEBINARS=[
  {id: 1, title:'Career Clarity Session — Month 1',date:'Apr 20, 2026 · 5:00 PM',week:4,regs:42,status:'upcoming'},
  {id: 2, title:'Stream Selection Guide',date:'May 12, 2026 · 5:00 PM',week:8,regs:18,status:'upcoming'},
  {id: 3, title:'College Application Tips',date:'Jun 4, 2026 · 5:00 PM',week:12,regs:7,status:'upcoming'},
  {id: 4, title:'Intro to Career Planning',date:'Mar 10, 2026 · 5:00 PM',week:1,regs:89,status:'past'},
];

export const WEEKS=[
  {n:1,title:'Understanding Yourself',video:'https://example.com/week1',tasks:['Write about yourself','Your proudest moment','What drains you','What energises you','People you admire','Your values']},
  {n:2,title:'Exploring Interests',video:'https://example.com/week2',tasks:['Interest inventory','Deep dive activity','Interview a professional','Map your curiosity','Subject connection','Interest journal']},
  {n:3,title:'Personality & Strengths',video:'https://example.com/week3',tasks:['Strength spotting','Feedback from friends','Past success analysis','Natural talents list','Energy audit','Strength story']},
  {n:4,title:'Career Clusters',video:'https://example.com/week4',tasks:['Cluster overview','Research 3 careers','Career interview','Day-in-life journal','Skill gap analysis','Career vision board']},
];

export const QUESTIONS=[
  {id: 1, q:'When given a complex problem, you prefer to:',trait:'Analytical Thinking',correct:'a'},
  {id: 2, q:'In a group project, you naturally take the role of:',trait:'Leadership',correct:'a'},
  {id: 3, q:'Which activity would you enjoy most on a weekend?',trait:'Creativity',correct:'b'},
  {id: 4, q:'When you learn something new, you prefer:',trait:'Learning Style',correct:'a'},
  {id: 5, q:'Which subject excites you the most?',trait:'Academic Interest',correct:'a'},
  {id: 6, q:'When working on a task, you are more motivated by:',trait:'Motivation',correct:'c'},
  {id: 7, q:'You find it easier to:',trait:'Cognitive Style',correct:'d'},
  {id: 8, q:'Your ideal work environment would be:',trait:'Work Style',correct:'b'},
];

export const PAYMENTS=[
  {id: 1, name:'Rohan Kumar',phone:'+91 98765 43210',amount:'₹2,999',status:'success',ref:'RZP_20260410_001',date:'Apr 10, 2026'},
  {id: 2, name:'Arjun Verma',phone:'+91 76543 21098',amount:'₹2,999',status:'success',ref:'RZP_20260328_002',date:'Mar 28, 2026'},
  {id: 3, name:'Karan Singh',phone:'+91 54321 09876',amount:'₹2,999',status:'success',ref:'RZP_20260105_003',date:'Jan 5, 2026'},
  {id: 4, name:'Vikram Nair',phone:'+91 32109 87654',amount:'₹2,999',status:'success',ref:'RZP_20260220_004',date:'Feb 20, 2026'},
  {id: 5, name:'Anjali Mehta',phone:'+91 43210 98765',amount:'₹2,999',status:'failed',ref:'RZP_20260315_005',date:'Mar 15, 2026'},
  {id: 6, name:'Sonal Patel',phone:'+91 21098 76543',amount:'₹2,999',status:'pending',ref:'RZP_20260401_006',date:'Apr 1, 2026'},
];

export const TRAITS=[
  {name:'Analytical Thinking',score:82,color:'#4a90d9'},
  {name:'Leadership',score:67,color:'#f472b6'},
  {name:'Creativity',score:74,color:'#f59e0b'},
  {name:'Learning Style',score:88,color:'#34d399'},
  {name:'Academic Interest',score:71,color:'#a78bfa'},
  {name:'Motivation',score:79,color:'#fb923c'},
  {name:'Cognitive Style',score:65,color:'#60a5fa'},
  {name:'Work Style',score:83,color:'#4ade80'},
];

export function getInitials(name){
  return name.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase();
}

export const COLORS = ['#dbeafe:#1e40af','#dcfce7:#166534','#fef3c7:#92400e','#ede9fe:#5b21b6','#fce7f3:#831843','#e0f2fe:#0369a1','#fef9c3:#713f12','#ecfdf5:#065f46'];

export function avColor(i){
  const c = COLORS[i % COLORS.length].split(':');
  return { background: c[0], color: c[1] };
}
