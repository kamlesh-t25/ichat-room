const socket=io('http://localhost:8000');

const form=document.getElementById('formId');
const messageInp=document.getElementById('messageInp');
const messageContainer=document.querySelector('.container');


document.getElementById('joinChatButton').addEventListener('click', () => {
    const name = prompt('Enter your name to join chat');
    if (name) {
        socket.emit('new-user-joined', name);
        console.log(name);
    }
});

socket.on('user-joined', name => {
    append(`${name}  -: joined the chat`, 'right');
});

function append(message, position) {
    const messageElement = document.createElement('div');
    messageElement.innerHTML = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
}

form.addEventListener('submit',(e)=>{
    e.preventDefault();
    const message=messageInp.value;
    append(`You :- ${message}`,'right');
    socket.emit('send','message');
    messageInp.value='';
})

socket.on('receive',data=>{
    append(`${data.name} : ${data.message}`,'left');
})

socket.on('left',name=>{
    append(`${name}:-  left the chat room.`,'left');
})