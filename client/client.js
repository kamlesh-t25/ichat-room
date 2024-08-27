const socket=io('https://ichat-room-3.onrender.com');

const form=document.getElementById('formId');
const messageInp=document.getElementById('messageInp');
const messageContainer=document.querySelector('.container');

let hasJoined = false;

document.getElementById('joinChatButton').addEventListener('click', () => {
    const name = prompt('Enter your name to join chat');
    if (name) {
        socket.emit('new-user-joined', name);
        hasJoined=true;
        console.log(name);
    }
});

socket.on('user-joined', name => {
    // console.log('1111');
    append(`${name}  -: joined the chat`, 'right');
});

function append(message, position) {
    const messageElement = document.createElement('div');
    messageElement.innerHTML = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);

    //to scroll bottom
    messageContainer.scrollTop = messageContainer.scrollHeight;
}

form.addEventListener('submit',(e)=>{
    e.preventDefault();

    if (!hasJoined) {
        alert('You need to join the chat first!');
        messageInp.value="";
        return; 
    }

    const message=messageInp.value;
    append(`You :- ${message}`,'right');
    socket.emit('send',message);
    messageInp.value='';
    // console.log('2222');
})

socket.on('receive',data=>{
    append(`${data.name} : ${data.message}`,'left');
    console.log('3333');
})

socket.on('left',name=>{
    append(`${name}:-  left the chat room.`,'left');
})