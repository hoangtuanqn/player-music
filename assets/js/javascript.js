let $ = document.querySelector.bind(document)
let $$ = document.querySelectorAll.bind(document)
let playList = $('.playlist');
let headingNameSong = $('header h2')
let cdThumb = $('.cd-thumb')
let btnNextSong = $('.btn-next');
let btnPrevSong = $('.btn-prev');
let btnRepeatSong = $('.btn-repeat');
let btnRandomSong = $('.btn-random');
let noRepeatCurretSongIndex = [];
let btnPlaySong = $('.btn-toggle-play');
let progress = $('.progress');
let player = $('.player');
let audio = $('#audio');
let indexLoading = 0;
let imageRotate;
const KEY_PROJECT = 'H_TUAN_QN';

/*
    *Render danh sách bài hát -> xong
    *Tải thông tin bài hát khi loading vào website -> xong
    *Active bài hát được chọn -> song
    *Next song -> xong
    *Prev song -> xong
    *Repeat song -> xong
    *Play/Pause Song -> xong
    *Xử lý khi play thì nhạc chạy -> xong
    *Xử lý khi pause thì nhạc dừng -> xong
    *Next or Prev song thì auto play -> xong
    *Thanh tiến trình khi play song -> xong
    *Xử lý tua video -> xong
    *Xử lý repeat khi kết thúc bài hát -> xong
    *Random song -> xong
    *Click bài háy thì sẽ active -> xong
    *Scroll to active song -> xong
    *cuộn xuống thì ảnh cdThumb thu nhỏ lại -> xong
    *Xoay cdThumb khi play -> xong
    *Tính năng lazyload vui vui -> xong
    *Lưu thông tin khi load lại trang -> xong
*/ 
const app = {
    isRandom: false,
    isPlaying: false,
    isRepeat: false,
    currentSongIndex: 0,
    configs: JSON.parse(localStorage.getItem(KEY_PROJECT) || '{}'),
    setConfig(key, value) {
        this.configs[key] = value;
        localStorage.setItem(KEY_PROJECT, JSON.stringify(this.configs));
    },
    songs: [
        {
            name: 'Em Của Ngày Hôm Qua',
            singer: 'Sơn Tùng MTP',
            path: './assets/audio/song1.mp3',
            image: './assets/image/song1.jpg'
        },
        {
            name: 'Cạn Tình Như Thế',
            singer: 'Thành Đạt',
            path: './assets/audio/song2.mp3',
            image: './assets/image/song2.jpg'
        },
        {
            name: 'BadBye',
            singer: 'Wean',
            path: './assets/audio/song3.mp3',
            image: './assets/image/song3.jpg'
        },
        {
            name: 'Nổi Gió Lên',
            singer: 'Phan Như Quỳnh',
            path: './assets/audio/song4.mp3',
            image: './assets/image/song4.jpg'
        },
        {
            name: 'Đơn Côi',
            singer: 'Hạo Thiên',
            path: './assets/audio/song5.mp3',
            image: './assets/image/song5.jpg'
        },
        {
            name: 'Quân Tử Ý',
            singer: 'Lê Bảo Bình',
            path: './assets/audio/song6.mp3',
            image: './assets/image/song6.jpg'
        },
        {
            name: 'À Thì',
            singer: 'Linh Chi',
            path: './assets/audio/song7.mp3',
            image: './assets/image/song7.jpg'
        },
        {
            name: 'Vừa Hận Vừa Yêu',
            singer: 'Trung Tự',
            path: './assets/audio/song8.mp3',
            image: './assets/image/song8.jpg'
        },
        {
            name: 'Khóa Ly Biệt',
            singer: 'Anh Tú',
            path: './assets/audio/song9.mp3',
            image: './assets/image/song9.jpg'
        },
        {
            name: 'Ngày Đẹp Trời Để Nói Chia Tay',
            singer: 'Lou Hoàng',
            path: './assets/audio/song10.mp3',
            image: './assets/image/song10.jpg'
        },
        {
            name: 'Yêu Không Cần Hứa',
            singer: 'Vương Anh Tú',
            path: './assets/audio/song11.mp3',
            image: './assets/image/song11.jpg'
        },
        {
            name: 'Bay Giữa Ngân Hà',
            singer: 'Nam Cường',
            path: './assets/audio/song12.mp3',
            image: './assets/image/song12.jpg'
        },
        {
            name: 'Em Của Anh Đừng Của Ai',
            singer: 'Long Cao',
            path: './assets/audio/song13.mp3',
            image: './assets/image/song13.jpg'
        },
        {
            name: 'Bát Cơm Mặn',
            singer: 'Orange x Mew Amazing',
            path: './assets/audio/song14.mp3',
            image: './assets/image/song14.jpg'
        },
        {
            name: 'Bật Tình Yêu Lên',
            singer: 'Hòa Minzy',
            path: './assets/audio/song15.mp3',
            image: './assets/image/song15.jpg'
        },
        {
            name: 'Có Đâu Ai Ngờ',
            singer: 'Cầm',
            path: './assets/audio/song16.mp3',
            image: './assets/image/song16.jpg'
        },
        {
            name: 'Một Ngày Buồn',
            singer: 'Kiều Chi',
            path: './assets/audio/song17.mp3',
            image: './assets/image/song17.jpg'
        },
        {
            name: 'Đừng Làm Trái Tim Anh Đau',
            singer: 'Sơn Tùng MTP',
            path: './assets/audio/song18.mp3',
            image: './assets/image/song18.jpg'
        },
        {
            name: 'Trái Tim Lớn',
            singer: 'Hương Ly x Lê Trí Trung',
            path: './assets/audio/song19.mp3',
            image: './assets/image/song19.jpg'
        },
        {
            name: 'Có Ai Hẹn Hò Cùng Em Chưa',
            singer: 'Quân AP',
            path: './assets/audio/song20.mp3',
            image: './assets/image/song20.jpg'
        },
        {
            name: 'Tan Ca',
            singer: 'Đạt Ozy',
            path: './assets/audio/song21.mp3',
            image: './assets/image/song21.jpg'
        }
    ],
    renderListSong() {
        this.songs.forEach((item, index) => {
            playList.innerHTML += `
            <div class="song item-${index}">
                <div class="thumb" 
                    style="background-image: url('./assets/image/loading.gif');">
                </div>
                <div class="body">
                    <h3 class="title">${item.name}</h3>
                    <p class="singer">${item.singer}</p>
                </div>
                <div class="option">
                    <i class="fa-solid fa-ellipsis"></i>
                </div>
            </div>`
            let element = $(`.item-${index} .thumb`);
            if(element.getBoundingClientRect().top <= window.innerHeight) {
                indexLoading++;
            
                setTimeout(() => {
                    $(`.item-${index} .thumb`).style.backgroundImage = `url('${item.image}')`
                    $(`.item-${index} .thumb`).style.backgroundSize = 'cover'
                    this['item_' + index] = true;
                }, index * 200)
            }
            
        })
    },
    randomCurrenSongIndex() {

        // *random song in lists
        let newCurrenSongIndex;
        do {
            newCurrenSongIndex = Math.floor(Math.random() * this.songs.length);
        } while(
            newCurrenSongIndex === this.currentSongIndex || 
            noRepeatCurretSongIndex.some(item => item === newCurrenSongIndex)
        );
        noRepeatCurretSongIndex.push(newCurrenSongIndex);
        
        // *reset mảng về 0
        if(noRepeatCurretSongIndex.length >= this.songs.length) noRepeatCurretSongIndex.length = 0;

        this.currentSongIndex = newCurrenSongIndex;
        
    },
    runNextSong() {
        
        // *trường hợp không có random song
        if(!this.isRandom) {
            this.currentSongIndex++;
            if (this.currentSongIndex >= this.songs.length) {
                this.currentSongIndex = 0;
            }
        } else {
            // *trường hợp có random song
            this.randomCurrenSongIndex();
        }
        this.loadingInfoSong();
        this.runPlaySong();
    },
    blockPrevSong() {
        // *chặn nút lùi song khi sử dụng random
        btnPrevSong.classList.toggle('opacityReduce', this.isRandom);
        if(this.isRandom) {
            btnPrevSong.title = 'Tắt Random bài hát để sử dụng tính năng này';
        } else {
            btnPrevSong.title = '';
        }
    },
    runPrevSong() {
        if(!this.isRandom) {
            this.currentSongIndex--;
            if (this.currentSongIndex < 0) {
                this.currentSongIndex = this.songs.length - 1;
            }
            this.loadingInfoSong();
            this.runPlaySong();
        }
    },
    loadingInfoSong() {
        let data = this.songs[this.currentSongIndex];
        headingNameSong.textContent = data.name;
        cdThumb.style.backgroundImage = `url(${data.image})`;
        audio.src = data.path;
        $('.song.active-song')?.classList.remove('active-song');
        $(`.song.item-${this.currentSongIndex}`)?.classList.add('active-song');
    },
    runPlaySong(blockScrollIntoView = false) {
        audio.play();
        player.classList.add('playing');
        this.isPlaying = true;
        imageRotate.play();
        this.setConfig('currentSongIndex', this.currentSongIndex)
        if(!blockScrollIntoView) {
            this.scrollIntoViewActive();
        }
    },
    runPauseSong() {
        audio.pause();
        player.classList.remove('playing');
        this.isPlaying = false;
        imageRotate.pause();

    },
    handleEvent() {
        let _this = this;

        // *xử lý sự kiện khi bấm next song
        btnNextSong.addEventListener('click', () => {
            _this.runNextSong();
        })

         // *xử lý sự kiện khi bấm prev song
         btnPrevSong.addEventListener('click', () => {
            _this.runPrevSong();
        })

        // *xử lý sự kiện khi bấm repeat song
        btnRepeatSong.addEventListener('click', () => {
            _this.isRepeat = !_this.isRepeat;
            this.setConfig('isRepeat', _this.isRepeat);
            btnRepeatSong.classList.toggle('active', _this.isRepeat);
        })

        // *xử lý sự kiện khi bấm nút random
        btnRandomSong.addEventListener('click', () => {
            _this.isRandom = !_this.isRandom;
            this.setConfig('isRandom', _this.isRandom);

            btnRandomSong.classList.toggle('active', _this.isRandom);

            _this.blockPrevSong();
        })

        

        // *xử lý bấm vào nút play/pause song
        btnPlaySong.addEventListener('click', () => {
            if(_this.isPlaying) {
                audio.pause();
                player.classList.remove('playing');
                imageRotate.pause();
                
            } else {
                audio.play();
                player.classList.add('playing');
                imageRotate.play();
            }
            
            this.setConfig('currentSongIndex', this.currentSongIndex)
            _this.isPlaying = !_this.isPlaying;
        })

        // *cập nhật thanh tiến trình khi video phát
        audio.addEventListener('timeupdate', () => {
            let newProgress = Number.parseInt(audio.currentTime / audio.duration  * 100) || 0;
            progress.value = newProgress;
        })
        
        // * xử lý tua video
        progress.addEventListener('input', (e) => {
            audio.currentTime = (e.target.value / 100 * audio.duration) || 0;

            // nếu tua video hiện tại thì sẽ ko bị gọi hàm scrollIntoView ở phần runPlaySong
            _this.runPlaySong(true)
        })

        // *bấm nút tiếp/lùi bài hát trên bàn phím
        document.addEventListener('keydown', (e) => {
            if(e.code == 'ArrowRight') {
                _this.runNextSong();
            } else if (e.code == 'ArrowLeft'){
                _this.runPrevSong();
            }
            
        })

        // *xử lý khi bấm vào bài hát
        $$('.song').forEach((item, index) => {
            item.addEventListener('click', () => {
                _this.currentSongIndex = index;
                _this.loadingInfoSong();
                _this.runPlaySong();
            })
        })
        let cdWidth = cdThumb.offsetWidth;
        document.addEventListener('scroll', () => {
            let widthHeightNew = (cdWidth - document.documentElement.scrollTop);
            widthHeightNew = widthHeightNew > 0 ? widthHeightNew : 0
            cdThumb.style.height = widthHeightNew + 'px';
            cdThumb.style.width = widthHeightNew + 'px';
        })
    },
    scrollIntoViewActive() {
        // chỉ cuộn đến bài hát khi bài hát nằm ngoài viewport
        let element = $('.song.active-song');

        // *xử lý cuộn tới bài hát khi active.
        // *nếu bài hát nằm ngoài tầm nhìn mà được active thì sẽ scroll tới element đó
        // *bài hái bị che bởi div.class="dashboard" do có position thì cũng sẽ được scroll để nhìn thấy bài hát đó
        let topDownViewportHeight = (window.scrollY || document.documentElement.scrollTop) + window.innerHeight;
        let topDownElementHeight = (window.scrollY || document.documentElement.scrollTop) + 
            element.getBoundingClientRect().top + element.offsetHeight;
        if(topDownElementHeight > topDownViewportHeight || 
            element.getBoundingClientRect().top - element.offsetHeight <= 536) {
            $('.song.active-song')?.scrollIntoView({
                behavior: 'smooth',
                block: 'end'
            });
        }
    },
    executeEvent() {
        let _this = this;

        // *xử lý lặp lại bài hát khi kết thúc
        audio.addEventListener('ended', () => {
            if(_this.isRepeat) {
                audio.play();
            } else {
                _this.runNextSong();
            }
        })
    },
    importantEvent() {

        // *tạo cdThumb quay 360 độ
        imageRotate = cdThumb.animate([
            {
                transform: "rotate(360deg)"
            }
        ], {
            duration: 10000,
            iterations: Infinity,
            easing: 'linear'
        })
        imageRotate.pause();

        // *lazyload custom
        document.addEventListener('scroll', () => {
            if(indexLoading < this.songs.length) {

                for(let index = indexLoading; index <= this.songs.length; index++) {

                    let element = $(`.item-${index-1} .thumb`);
                    if(window.innerHeight >= element.getBoundingClientRect().top) {
                        setTimeout(() => {
                            $(`.item-${index} .thumb`).style.backgroundImage = `url('${this.songs[index].image}')`
                            $(`.item-${index} .thumb`).style.backgroundSize = 'cover'
                            this['item_' + index] = true;
                        }, 1000)
                        indexLoading++;
                    }

                }
            }
        })

        // *update info user select
        this.isRandom = this.configs.isRandom || false;
        this.isRepeat = this.configs.isRepeat || false;
        this.currentSongIndex = this.configs.currentSongIndex || 0;
        if(this.isRepeat) {
            btnRepeatSong.classList.add('active');
        }
        if(this.isRandom) {
            btnPrevSong.classList.add('opacityReduce')
            btnRandomSong.classList.add('active');

        }
    },
    start() {

        // *sự kiện bắt buộc xảy ra
        this.importantEvent();

        // *tải danh sách bài hát
        this.renderListSong();

        // *loading thông tin bài hát hiện tại
        this.loadingInfoSong();

        // *xử lý các sự kiện khi Click
        this.handleEvent();

        // *thực thi các sự kiện đã được click
        this.executeEvent();

        
    }
}
app.start();