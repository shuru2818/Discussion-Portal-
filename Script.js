      let submitbtn = document.getElementById("submitbtn");
      let subject = document.getElementById("subject");
      let question = document.getElementById("question");
      let downdiv = document.getElementById("downdiv");
      let rightdiv = document.getElementById("rightdiv");
      let newbtn = document.getElementById("newbtn");
      newbtn.addEventListener("click", () => {
        rightdiv.innerHTML = `
        
          <div id="main">
          <h1>Welcome to Decision Portal!</h1>
          <p>Enter a subject and question to get started</p>
          <input type="text" placeholder="Subject" id="subject" />
          <textarea name="text" id="question" placeholder="Question"></textarea>
          <button id="submitbtn" onclick=submitquestion()>Submit</button> </div>   
        
        `;
      });

      //   Localstorage
      let questions = JSON.parse(localStorage.getItem("queslist")) || [];

      function savetolocal() {
        localStorage.setItem("queslist", JSON.stringify(questions));
      }

      // RENDER function
      function renderquestion() {
        questions.sort((a, b) => b.fav - a.fav);
        downdiv.innerHTML = "";
        questions.forEach((q, index) => {
          let quesdiv = document.createElement("div");

          quesdiv.innerHTML = `
             <div>
                <h1 style= "display:inline">${q.subject}</h1>
                <button id="fav"  onclick="event.stopPropagation(); togglefunc(${index})">
                  ${q.fav ? "❤️" : "🤍"}
                </button>
                <p>${q.question}</p>
                <span>${timego(q.date)}</span>
            </div>
            `;
          downdiv.append(quesdiv);

          quesdiv.addEventListener("click", () => {
            openquesdiv(index);
          });
        });
      }

      //select function

      function openquesdiv(index) {
        let select = questions[index];

        rightdiv.innerHTML = `
        <div id="main">
        <div>
            <h2>Question</h2>
            <div id="quesdiv">
                <h1>${select.subject}</h1>
                <p>${select.question}</p>
            </div>
            <button onclick=resolve(${index}) id="resolve-btn">Resolve</button>
            
        <div>
            <h2>Response</h2>
            <div id="responselist"></div>
        </div>

            <h2>Add Response</h2>
        <div id="respdiv">
            <input type="text" placeholder="Enter Name" id="res-name">
            <textarea name="textarea" id="res-comment" placeholder="Enter Comment"> </textarea>
            <button id="respbtn" onclick=addresponse()>Add Response</button>
        </div>
        </div>
        <div>
        `;

        renderresponse(index);
        document.getElementById("respbtn").addEventListener("click", () => {
          addresponse(index);
        });
      }

      //   response add logic

      function addresponse(index) {
        let name = document.getElementById("res-name");
        let comment = document.getElementById("res-comment");

        if (name.value == "" || comment.value == "") {
          alert("fields cant be empty");
          return;
        }

        let newresponse = {
          name: name.value,
          comment: comment.value,
          upvote: 0,
          downvote: 0,
          dateset:Date.now()
        };

        questions[index].responses.push(newresponse);
        savetolocal();
        renderresponse(index);
        name.value = "";
        comment.value = "";
      }

      // response render logic

      function renderresponse(index) {
        let responselist = document.getElementById("responselist");
        responselist.innerHTML = "";
        questions[index].responses.forEach((respp, rIndex) => {
          let div = document.createElement("div");
          div.innerHTML = `
            <div>
                <h1>${respp.name}</h1>
                <p>${respp.comment}</p>
                <button onclick="upvote(${index}, ${rIndex})">👍🏻 ${respp.upvote}</button>
                <button onclick="downvote(${index}, ${rIndex})">👎🏻 ${respp.downvote}</button>
                

            </div>
            `;
          responselist.append(div);
        });
      }

      //   submit question task
      renderquestion();

      function submitquestion() {
        let subject = document.getElementById("subject");
        let question = document.getElementById("question");
        if (subject.value == "" || question.value == "") {
          alert("Fields can't be empty");
          return;
        }

        let newquestion = {
          subject: subject.value,
          question: question.value,
          responses: [],
          fav: false,
          date: Date.now()
        };

        questions.push(newquestion);
        savetolocal();
        renderquestion();
        subject.value = "";
        question.value = "";
      }
      submitbtn.addEventListener("click", submitquestion);

      // resolve function
      function resolve(index) {
        let resolvebtn = document.getElementById("resolve-btn");
        resolvebtn.addEventListener("click", () => {
          questions.splice(index, 1);
          savetolocal();
          renderquestion();

          rightdiv.innerHTML = `
            <div id="main">
            <h1>Welcome to Decision Portal!</h1>
            <p>Enter a subject and question to get started</p>
            <input type="text" placeholder="Subject" id="subject" />
            <textarea name="text" id="question" placeholder="Question"></textarea>
            <button id="submitbtn" onclick= submitquestion()>Submit</button> </div>
            `;
        });
      }

      let search = document.getElementById("search");
      search.addEventListener("input", () => {
        let searched = search.value.toLowerCase();

        let filtered = questions.filter((q) => {
          return (
            q.subject.toLowerCase().includes(searched) ||
            q.question.toLowerCase().includes(searched)
          );
        });

        renderfilterquestion(filtered);
      });

      function renderfilterquestion(filtered) {
        downdiv.innerHTML = "";
        if (filtered.length === 0) {
          downdiv.innerHTML = `
          <div>
            <p>Data Not Found</p>
          </div>
          `;
        }
        filtered.forEach((q, index) => {
          let div = document.createElement("div");
          div.innerHTML = `
          <div>
                <h1 style= "display:inline">${highlight(q.subject, search.value)}</h1>
                <button id="fav"  onclick="event.stopPropagation(); togglefunc(${index})">
                  ${q.fav ? "❤️" : "🤍"}
                </button>
                <p>${q.question}</p>
            </div>
          `;
          downdiv.append(div);
        });
      }

      function togglefunc(index) {
        questions[index].fav = !questions[index].fav;
        savetolocal();
        renderquestion();
      }

      function upvote(qIndex, rIndex) {
        questions[qIndex].responses[rIndex].upvote++;
        savetolocal();
        renderresponse(qIndex);
      }

      function downvote(qIndex, rIndex) {
        questions[qIndex].responses[rIndex].downvote++;
        savetolocal();
        renderresponse(qIndex);
      }

      function highlight(text, search){
        if(!search) return text;

        let word = new RegExp(`(${search})`, "gi")

        return text.replace(word, `<span class="highlight">$1</span>`)
      };

      function timego(timestamp) {
        let second = Math.floor((Date.now() - timestamp) / 1000);
        if (second < 60) {
          return "Just Now";
        }

        let mins = Math.floor(second / 60);
        if (mins < 60) {
          return mins + (mins === 1 ? "minute ago" : "minutes ago");
        }

        let hour = Math.floor(mins / 60);
        if (hour < 1) {
          return hour + (hour === 1 ? "Hour ago" : "hours ago");
        } 

        let day = Math.floor(hour / 24);
        if (day < 1) {
          return day + (day === 1 ? "day ago" : "days ago");
        }
      }
