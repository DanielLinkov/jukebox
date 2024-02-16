
export default {
	inject: ['playQueue'],
	emit: ['playing','pause','previous','next','shuffle','repeat','select-artist','select-album','toggle-queue'],
	watch: {
		song(newVal,oldVal){
			if(newVal){
				this.url = newVal.url;
				this.$refs.audio.load();
				this.$refs.audio.currentTime = 0;
			}else{
				this.url = null;
				this.isPlaying = false;
			}
			this.$refs.playbackProgress.style.width = '0%';
		}
	},
	data(){
		return {
			originalPageTitle: '',
			song: null,
			url: null,
			isPlaying: false,
			isMute: false
		}
	},
	computed : {
		songDuration(){
		}
	},
	methods: {
		async play(songIdToPlay,play=true){
			this.song = this.playQueue.find(song => song.id === songIdToPlay) || null;
			if(!this.song){
				document.title = this.originalPageTitle;
				return;
			}
			document.title = `${this.song.title} - ${this.song.artist} [${this.originalPageTitle}]`;
			if(!play)
				return;
			await this.$nextTick();
			this.$refs.audio.play();
			this.isPlaying = true;
			this.$emit('playing',this.song.id);
		},
		playNext(){
			if(!this.song)
				return;
			const index = this.playQueue.findIndex(song => song.id === this.song.id);
			if(index === -1)
				return;
			if(index < this.playQueue.length - 1){
				this.play(this.playQueue[index + 1].id,this.isPlaying);
			}else{
				this.isPlaying = false;
			}
		},
		playPrevious(){
			if(!this.song)
				return;
			const index = this.playQueue.findIndex(song => song.id === this.song.id);
			if(index === -1)
				return;
			if(index > 0){
				this.play(this.playQueue[index - 1].id,this.isPlaying);
			}else{
				this.$refs.audio.currentTime = 0;
			}
		},
		onVolumeSlide(event){
			this.$refs.audio.volume = event.target.value;
			localStorage.setItem('jukebox:volume', event.target.value);
			this.isMute = event.target.value == 0;
		},
		onPrevious() {
			this.playPrevious();
		},
		onPlayPause() {
			if(this.isPlaying){
				this.$refs.audio.pause();
				this.isPlaying = false;
				this.$emit('pause');
			}else if (this.url){
				this.$refs.audio.play();
				this.isPlaying = true;
				this.$emit('playing',this.song.id);
			}
		},
		onNext() {
			this.playNext();
		},
		onShuffle() {
			this.$emit('shuffle');
		},
		onRepeat() {
			this.$emit('repeat');
		},
		onProgressClicked(event){
			const rect = event.target.closest('.progress').getBoundingClientRect();
			const x = event.clientX - rect.left;
			const width = rect.width;
			const progress = x / width;
			this.$refs.audio.currentTime = this.$refs.audio.duration * progress;
		},
		selectArtist(){
			if(this.song?.artist)
				this.$emit('select-artist',this.song.artist);
		},
		selectAlbum(){
			if(this.song?.album)
				this.$emit('select-album',this.song.album);
		}
	},
	mounted(){
		const volume = localStorage.getItem('jukebox:volume') || 0.5;
		this.$refs.audio.volume = volume;
		this.$refs.volumeSlider.value = volume;
		this.isMute = volume == 0;

		this.$refs.audio.addEventListener('canplay', () => {
			if(this.isPlaying)
				this.$refs.audio.play();
			else
				this.$refs.audio.pause();
		});
		this.$refs.audio.addEventListener('play', () => {
			this.$emit('playing',this.song.id);
		});
		this.$refs.audio.addEventListener('ended', () => {
			this.$emit('ended');
			if(this.isPlaying){
				this.playNext();		
			}
		});
		setInterval(() => {
			if(this.song && this.isPlaying){
				this.$refs.playbackProgress.style.width = (this.$refs.audio.currentTime / this.$refs.audio.duration * 100) + '%';
				this.$refs.songProgressTime.textContent = `${String(Math.floor(this.$refs.audio.currentTime / 60)).padStart(2,0)}:${String(Math.floor(this.$refs.audio.currentTime % 60)).padStart(2,0)}`;
				this.$refs.songDuration.textContent = `${String(Math.floor(this.$refs.audio.duration / 60)).padStart(2,0)}:${String(Math.floor(this.$refs.audio.duration % 60)).padStart(2,0)}`;
			}
		},30);
	},
	created(){
		this.originalPageTitle = document.title;
	},
	template: /* html */`
		<div class="w-100 d-flex flex-column player z-3">
			<div class="song-info text-white position-absolute start-0 ps-2">
				<div title="Song title" class="fw-bold">[{{ song?.track }}] {{ song ? song.title : 'No song selected' }}</div>
				<div>
					<a href="#" title="Artist" class="text-white" @click="selectArtist">{{ song?.artist || '—' }}</a>
					&bull;
					<a href="#" title="Album" class="text-white" @click="selectAlbum">{{ song?.album || '—' }}</a>
					&bull;
					<span title="Year">{{ song?.year || '—' }}</span>
				</div>
			</div>
			<div class="controls d-flex flex-column justify-content-center mx-auto position-relative">
				<div class="position-absolute start-100 top-0 ps-2"><button class="btn btn-secondary" title="Play queue" @click="$emit('toggle-queue')"><i class="bi bi-music-note-list"></i></button></div>
				<div class="btn-group mx-auto">
					<button class="btn btn-secondary" title="Shuffle" @click="onShuffle"><i class="bi bi-shuffle"></i></button>
					<button class="btn btn-secondary" title="Previous" @click="onPrevious"><i class="bi bi-skip-backward-fill"></i></button>
					<button class="btn btn-secondary" title="Play/Pause" @click="onPlayPause"><i class="bi" :class="[ isPlaying ? 'bi-pause-fill' : 'bi-play-fill' ]"></i></button>
					<button class="btn btn-secondary" title="Next" @click="onNext"><i class="bi bi-skip-forward-fill"></i></button>
					<button class="btn btn-secondary opacity-50" title="Repeat" @click="onRepeat"><i class="bi bi-repeat"></i></button>
				</div>
				<div class="d-flex gap-2 justify-content-center align-items-center">
					<div ref="songProgressTime" class="text-white text-start d-inline-block" style="width:4.2rem;">&mdash;</div>
					<div class="progress flex-grow-0" style="width:30rem" @click="onProgressClicked">
						<div class="progress-bar" ref="playbackProgress"></div>
					</div>
					<div ref="songDuration" class="text-white text-end d-inline-block" style="width:4.2rem;">&mdash;</div>
				</div>
			</div>
			<div class="volume pt-2 position-absolute end-0 pe-2">
				<div class="bg-primary py-1 px-2 rounded-5 d-flex align-items-center gap-1">
					<i class="bi" :class="[ isMute ? 'bi-volume-mute-fill' : 'bi-volume-off-fill' ]"></i>
					<input @input="onVolumeSlide" ref="volumeSlider" type="range" value="0.5" class="form-range" min="0" max="1" step="0.02">
					<i class="bi bi-volume-up-fill"></i>
				</div>
			</div>
			<audio :src="url" preload="auto" ref="audio"></audio>
		</div>
	`
}