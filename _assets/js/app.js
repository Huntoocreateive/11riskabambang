
var url = new URL(window.location.href);
var to = url.searchParams.get("to");
if (to==null || to=="") {
    document.getElementById('guest').innerHTML = "Guest";
} else {
    document.getElementById('guest').innerHTML = to;
}

let formMessage = document.getElementById('formMessage');
const btnMessage = document.getElementById('btnMessage');
const sendLoading = document.getElementById('send-loading');
const messageList = document.getElementById('tinyslider-container-message');

document.addEventListener('DOMContentLoaded', function() {
    /* 
    |======================================
    | APP INIT 
    |======================================
    */
    AOS.init();
    
    /* 
    |======================================
    | OPENING SCRIPT
    |======================================
    */
    // animate spouse text opening
    const headerSpouseText = document.querySelector('#header h1');
    headerSpouseText.innerHTML = headerSpouseText.textContent.replace(/\S/g, "<span class='letter'>$&</span>");
    anime.timeline()
        .add({
            targets: '#header h1 .letter',
            scale: [4,1],
            opacity: [0,1],
            translateZ: 0,
            easing: "easeOutExpo",
            duration: 950,
            delay: (el, i) => 150*i
        });
    // btn sound and open the opening
    const btn_open = document.querySelector('#btn-open-opening');
    const btn_play = document.querySelector('#btn-play');
    const audio = document.querySelector('#audio');
    
    btn_open.addEventListener('click', function(e) {
        for(let aos of document.querySelectorAll('.aos-init')) {
            aos.classList.remove('aos-animate');
        }
        setTimeout(() => {
            AOS.refresh();
        }, 2000);
        
        btn_play.innerHTML = '<i class="ri ri-volume-high"></i>';
        audio.play();
    })
    btn_play.addEventListener('click', function() {
        if (audio.paused) {
            btn_play.innerHTML = '<i class="ri ri-volume-high"></i>';
            audio.play();
        } else {
            btn_play.innerHTML = '<i class="ri ri-volume-off"></i>';
            audio.pause();
        }
    })
   

    /* 
    |======================================
    | PAGE SCRIPT
    |======================================
    */
    // timezz : countdown
    timezz('#countdown-row-1, #countdown-row-2', {
        date: new Date(2025, 6, 12, 9, 0),
        stop: false,
        canContinue: false,
        withYears: false,
        beforeCreate() {},
        beforeDestroy() {},
        update(event) {},
    });

    const btn_href_page = document.querySelectorAll('.page-scroll');
    for (let btn of btn_href_page) {
        btn.addEventListener('click', function(e) {
            window.scrollTo({
                top: document.querySelector(`${this.getAttribute('href')}`).offsetTop - 80,
                behavior: 'smooth'
            });
            e.preventDefault();
        })
    }
    // back to top & nav-item active class
    const btn_to_top = document.querySelector('#btn-to-top');
    const navbar = document.querySelector('.navbar');
    const navlinks = document.querySelectorAll('.nav-link.page-scroll');
    let str_section_query = "";
    for (let indexNavlink = 0; indexNavlink < navlinks.length; indexNavlink++) {
        if (indexNavlink !== navlinks.length-1) {
            str_section_query += `${navlinks[indexNavlink].getAttribute('href')}, `;
        } else {
            str_section_query += `${navlinks[indexNavlink].getAttribute('href')}`;
        }
    }
    sectionlistener = document.querySelectorAll(str_section_query);
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('navbar-scrolled');
            btn_to_top.style.display = 'flex';
        } else {
            navbar.classList.remove('navbar-scrolled');
            btn_to_top.style.display = 'none';
        }

        for (let link of document.querySelectorAll('.nav-link')) {
            link.classList.remove('active');
        }
        for (let section of sectionlistener) {
            if (
                window.scrollY > (section.offsetTop - 100) &&
                window.scrollY < (section.offsetTop + section.offsetHeight)
            ) {
                for (let link of document.querySelectorAll('.nav-link')) {
                    link.classList.remove('active');
                }
                document.querySelector(`.nav-link[href="#${section.id}"]`).classList.add('active');
            }
        }
    })
    
    getData();
});

async function getData(){
    const response= await fetch('https://script.google.com/macros/s/AKfycbzanfx7b3rMDB1gd91egaMtr8fVTqchoGQsz684ANugqamuXfY-bEHgd1kLYyb4KUyB/exec?sheetName=RiskaBambang');
    const data= await response.json();
    
    length = data.length;
    let content ='';
    for(i=0;i<length;i++)
    {
        sort = length - (i+1);
        const nama = data[sort].nama;
        const pesan = data[sort].pesan;
        const date = new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date(data[sort].date)).replace(',', '');
        
        content +=
        `<div class="tinyslider-item tinyslider-item-message mb-2">
            <div class="fw-bold">`+ nama +`</div>
            <div class="text-sm text-gray">`+ date +`</div>
            <div class="text-md">
                `+ pesan +`
            </div>
        </div>`
    }
    messageList.innerHTML = content;
}

async function postData(url = "", data = {}) {
  const response = await fetch(url, {
    method: 'POST',
    mode: 'no-cors',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  return response;
}

formMessage.addEventListener('submit', function (e) {
    e.preventDefault();
    
    let date = new Date();
    let nama = document.getElementById('nama').value;
    let nomor_hp = document.getElementById('nomor_hp').value;
    let pesan = document.getElementById('pesan').value;
    
    let body = {
        "sheetName": "RiskaBambang",
        date,
        nama,
        nomor_hp,
        pesan,
    }
    
    btnMessage.setAttribute('disabled', 'true');
    sendLoading.classList.remove('d-none');
    sendLoading.classList.add('d-flex');
    
    postData('https://script.google.com/macros/s/AKfycbzanfx7b3rMDB1gd91egaMtr8fVTqchoGQsz684ANugqamuXfY-bEHgd1kLYyb4KUyB/exec', body).then((data) => {
        document.getElementById('nama').value = '';
        document.getElementById('nomor_hp').value = '';
        document.getElementById('pesan').value = '';
        btnMessage.removeAttribute('disabled');
        sendLoading.classList.remove('d-flex');
        sendLoading.classList.add('d-none');
    
        getData();
    }).catch(error => console.error('Error:', error));
});

let modalAmplop = document.getElementById('modal-amplop');
let btnAmplop = document.getElementById('btn-amplop');
let successCopy = document.getElementById('success-copy');
function copyRekening(id) {
    /* Get the text field */
    let copyText = document.getElementById(id);

    /* Select the text field */
    copyText.select();
    copyText.setSelectionRange(0, 99999); /* For mobile devices */

    /* Copy the text inside the text field */
    navigator.clipboard.writeText(copyText.value);

    toggleModal()
    createToast()

    successCopy.classList.remove('d-none');
    successCopy.classList.add('d-flex');
}
function toggleModal() {
    modalAmplop.classList.toggle('show')
    modalAmplop.classList.toggle('d-block')
}
function createToast() {
    successCopy.classList.remove('d-none');
    successCopy.classList.add('d-flex');

    // Close the toast after 5 seconds
    setTimeout(() => {
        successCopy.classList.remove('d-flex');
        successCopy.classList.add('d-none');
    }, 5000);
}