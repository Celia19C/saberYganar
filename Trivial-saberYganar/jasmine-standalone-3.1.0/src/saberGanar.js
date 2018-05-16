function start() {
    'use strict';

    const questionsWithAnswers = [{
        id: 1,
        question: "¿Cuál es la capital de Portugal?",
        answers: [
            { id: 0, answer: "Faro", isCorrect: false, idQuestion: 1 },
            { id: 1, answer: "Oporto", isCorrect: false, idQuestion: 1 },
            { id: 2, answer: "Lisboa", isCorrect: true, idQuestion: 1 }
        ]
    },
    {
        id: 2,
        question: "¿Cuál es la capital de Egipto?",
        answers: [
            { id: 0, answer: "Faro", isCorrect: false, idQuestion: 2 },
            { id: 1, answer: "El Cairo", isCorrect: true, idQuestion: 2 },
            { id: 2, answer: "Lisboa", isCorrect: false, idQuestion: 2 }
        ]
    },
    {
        id: 3,
        question: "¿Cuál es la capital de Zambia?",
        answers: [
            { id: 0, answer: "Lusaka", isCorrect: true, idQuestion: 4 },
            { id: 1, answer: "Oporto", isCorrect: false, idQuestion: 4 },
            { id: 2, answer: "Lisboa", isCorrect: false, idQuestion: 4 }
        ]
    },
    {
        id: 4,
        question: "¿Cuál es la capital de Jordania?",
        answers: [
            { id: 0, answer: "Madrid", isCorrect: false, idQuestion: 5 },
            { id: 1, answer: "Amán", isCorrect: true, idQuestion: 5 },
            { id: 2, answer: "Lisboa", isCorrect: false, idQuestion: 5 }
        ]
    },
    {
        id: 5,
        question: "¿Cuál es la capital de Panama?",
        answers: [
            { id: 0, answer: "Madrid", isCorrect: false, idQuestion: 6 },
            { id: 1, answer: "Oporto", isCorrect: false, idQuestion: 6 },
            { id: 2, answer: "Ciudad de Panamá", isCorrect: true, idQuestion: 6 }
        ]
    }];







    const boxQuestions = document.querySelector('.questions');
    const btnSend = document.querySelector('.btn');
    const btnNext = document.querySelector('.btnNext');
    const btnStart = document.querySelector('.btnStart');
    const btnSave = document.querySelector('.btnSave');
    let answerResultMessage = document.querySelector('.message');
    let timer = document.querySelector('.seconds');
    let nameBox = document.querySelector('.nameBox');
    let scoreUI = document.querySelector('.scoreUI');
    let totalPoints = 0;
    let seconds = 0;
    let currentQuestionIndex = 0;
    let inSetInterval;
    btnSend.disabled = true;



    //INICIALIZA el juego y el tiempo

    btnStart.addEventListener('click', onStart);
    function onStart() {
        btnStart.classList.toggle('invisible');
        btnSend.classList.toggle('invisible');
        boxQuestions.classList.remove('invisible');
        currentQuestionIndex = 0;
        paintQuestions();
        inSetInterval = setInterval(startTimer, 1000) //El setInterval en una variable par luego utilizarla con el clearInterval
    }


    //SUCESIÓN DE PREGUNTAS

    function paintQuestions() {
        if (currentQuestionIndex < questionsWithAnswers.length) {
            paintCurrentQuestion(questionsWithAnswers[currentQuestionIndex]);
            currentQuestionIndex++;
            clearAnswerResultMessage();
        } else {
            showUserNameBox()
            disableAnswerButton();
            stopTimer();
        }
    }

    function paintCurrentQuestion(question) {
        boxQuestions.innerHTML =
            `<div class="questionBox" id="${question.id}">${question.question}</div>`;
        for (let x = 0; x < question.answers.length; x++) {
            boxQuestions.innerHTML +=
                `<div class="checkboxBox">
            <input type="radio" id="${question.answers[x].id}" name="options" class="answer" value="${question.answers[x].answer}"/>
            <label for="${question.answers[x].id}">${question.answers[x].answer}</label>
            </div>`;
        }
    }

    function clearAnswerResultMessage() {
        answerResultMessage.innerHTML = '';
    }

    function showUserNameBox() {
        nameBox.classList.remove('invisible');

    }
    //Set interval con la función startTimer para que cada segundo compruebe que los segundos no han llegado a 20.
    //Si llega a 20 ejecuta la función de pintar las preguntas, es decir, pasa a la siguiente y resta 3 puntos.

    function startTimer() {
        seconds++;
        paintRealTime()
        if (seconds == 20) {
            seconds = 0;
            paintQuestions();
            pointsFinishTimer()
            console.log(totalPoints)
        }
        timeDisabledButton();//Comprueba cada segundo si hay algún check seleccionado para habilitar el botón (cada segundo por el setInterval)
    }

    function paintRealTime() {
        timer.innerHTML = `${seconds}`;
    }

    function pointsFinishTimer() {
        totalPoints -=3;
        printScoreUIRealTime()
    }

    function printScoreUIRealTime() {
        scoreUI.innerHTML = ` ${totalPoints} puntos`
    }
    function timeDisabledButton() {
        enableAnswerButton();
    }

    function enableAnswerButton() {
        disableAnswerButton()
        const RadioAnswers = document.querySelectorAll('.answer');
        for (let i = 0; i < RadioAnswers.length; i++) {
            if (RadioAnswers[i].checked) {
                btnSend.disabled = false;
            }
        }
    }

    function disableAnswerButton() {
        btnSend.disabled = true;
    }

    
    //SELECCIONAR RESPUESTA Y PUNTOS

    btnSend.addEventListener('click', onSend);

    function onSend() {
        readUserAnswer();
        paintQuestions();
    }

    function readUserAnswer(found, optionChecked) {
        const radioAnswers = document.querySelectorAll('.answer'); //Es un nodeList. No es un array, es como un objeto array. Debes convertirlo en un array para aplicarle cualquiera de sus métodos funcionales. Un FOR normal sí que funciona con el nodeList.

        // optionChecked = [].slice.call(radioAnswers).find(function (radioAnswer) {
        //     return radioAnswer.checked;
        //     console.log(optionChecked) //Es como un for con un if. Recorre el array creado y devuelve/encuentra el PRIMER elemento que cumpla la condición. El for devolvería el último a menos que le pongas el break.
        // })
        for (let i = 0; i < radioAnswers.length; i++) { 
            if (radioAnswers[i].checked) {
                optionChecked = radioAnswers[i];
                break;
            }
        }
        found = questionsWithAnswers.find(function (question) {
            const questionBox = document.querySelector('.questionBox');
            if (question.id == questionBox.id) {
                return question
            }
        });
        correctIncorrectAnswer(found, optionChecked)
    }

    function correctIncorrectAnswer(found, optionChecked) {
        if (found.answers[optionChecked.id].isCorrect) {
            console.log('BIEN')
            answerResultMessage.innerHTML = `<h3> ¡Correcta! </h3>`;
            if (seconds <= 2) {
                totalPoints += 2;
            }
            else if (seconds >= 3 && seconds <= 10) {
                totalPoints += 1;
            }
            else {
                totalPoints;
            }
        }
        else {
            console.log('MAL')
            answerResultMessage.innerHTML = `<h3> ¡Incorrecta! </h3>`;
            if (seconds >= 11) {
                totalPoints -= 2;
            }
            else if (seconds <= 10) {
                totalPoints -= 1;
            }
        }
        printScoreUIRealTime()
        console.log(totalPoints)
        seconds = 0;
    }


    // MARCADOR 

    btnSave.addEventListener('click', onSave);

    function onSave() {
        saveScoreAndName();
        resetTimeAndPoints();
        cleanButtonsAndBoxes();
    }

    let score = { //Se guardan los nombres y las puntuaciones de cada jugador
        names:
            [],
        points:
            []
    };

    function saveScoreAndName() {
        let name = document.querySelector('#inputNameId').value;
        score.names.push(name);;
        listNames = score.names;
        console.log(listNames);
        score.points.push(totalPoints);
        sumPoints = score.points;
        console.log(sumPoints);
        printScoreAndName(listNames, sumPoints)
    }
    
    function printScoreAndName(listNames, sumPoints) {
        let scoreList = document.querySelector('.list');
        let add = '';
        for (let i = 0; i < listNames.length; i++) {
            add +=
                `<li class="eachBoxPlayer">
            ${listNames[i]} - <div class="actualPoints"> ${sumPoints[i]} puntos </div>
        </li>`;
        };
        scoreList.innerHTML = add;
    }



    //RESETEA temporizador y puntos y lo deja preparado para iniciar el juego de nuevo

    function stopTimer() {
        seconds = 0;
        clearInterval(inSetInterval);
    }

    function resetTimeAndPoints() {
        totalPoints = 0;
        printScoreUIRealTime()
        stopTimer();
        timer.innerHTML = '';
    }

    function cleanButtonsAndBoxes() {
        let name = document.querySelector('#inputNameId').value = '';
        btnStart.classList.toggle('invisible');
        btnSend.classList.toggle('invisible');
        boxQuestions.classList.add('invisible');
        nameBox.classList.add('invisible');
        answerResultMessage.innerHTML = '';
    }

}
