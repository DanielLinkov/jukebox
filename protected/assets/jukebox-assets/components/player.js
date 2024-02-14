
export default {
	// props: ['song'],
	watch: {
		async song(newVal,oldVal){
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
		onVolumeSlide(event){
			this.$refs.audio.volume = event.target.value;
			localStorage.setItem('jukebox:volume', event.target.value);
			this.isMute = event.target.value == 0;
		},
		onPrevious() {
			this.$emit('previous');
		},
		onPlayPause() {
			if(this.isPlaying){
				this.$refs.audio.pause();
				this.isPlaying = false;
				this.$emit('pause');
			}else if (this.url){
				this.$refs.audio.play();
				this.isPlaying = true;
				this.$emit('play');
			}
		},
		onNext() {
			this.$emit('next');
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
		}
	},
	mounted(){
		const volume = localStorage.getItem('jukebox:volume') || 0.5;
		this.$refs.audio.volume = volume;
		this.$refs.volumeSlider.value = volume;
		this.isMute = volume == 0;

		this.$refs.audio.addEventListener('canplay', () => {
			this.$refs.audio.play();
			this.isPlaying = true;
			this.$refs.songDuration.textContent = `${String(Math.floor(this.$refs.audio.duration / 60)).padStart(2,0)}:${String(Math.floor(this.$refs.audio.duration % 60)).padStart(2,0)}`;
		});
		this.$refs.audio.addEventListener('play', () => {
			this.$emit('play');
		});
		this.$refs.audio.addEventListener('ended', () => {
			this.$emit('ended');
			this.isPlaying = false;
		});
		setInterval(() => {
			if(this.song && this.isPlaying){
				this.$refs.playbackProgress.style.width = (this.$refs.audio.currentTime / this.$refs.audio.duration * 100) + '%';
				this.$refs.songProgressTime.textContent = `${String(Math.floor(this.$refs.audio.currentTime / 60)).padStart(2,0)}:${String(Math.floor(this.$refs.audio.currentTime % 60)).padStart(2,0)}`;
			}
		},30);
	},
	template: /* html */`
		<div class="w-100 d-flex justify-content-between player">
			<div class="song-info text-white">
				<div title="Song title" class="fw-bold">[{{ song?.track }}] {{ song ? song.title : 'No song selected' }}</div>
				<div>
					<span title="Artist">{{ song?.artist || '—' }}</span>
					&bull;
					<span title="Album">{{ song?.album || '—' }}</span>
					&bull;
					<span title="Year">{{ song?.year || '—' }}</span>
				</div>
			</div>
			<div class="controls d-flex flex-column justify-content-center">
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
			<div class="volume pt-2">
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