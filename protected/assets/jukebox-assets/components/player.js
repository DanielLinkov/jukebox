
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
		}
	},
	computed : {
		songDuration(){
		}
	},
	methods: {
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
		onProgressClicked(event){
			const rect = event.target.getBoundingClientRect();
			const x = event.clientX - rect.left;
			const width = rect.width;
			const progress = x / width;
			this.$refs.audio.currentTime = this.$refs.audio.duration * progress;
		}
	},
	mounted(){
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
		});
		setInterval(() => {
			if(this.song && this.isPlaying){
				this.$refs.playbackProgress.style.width = (this.$refs.audio.currentTime / this.$refs.audio.duration * 100) + '%';
				this.$refs.songProgress.textContent = `${String(Math.floor(this.$refs.audio.currentTime / 60)).padStart(2,0)}:${String(Math.floor(this.$refs.audio.currentTime % 60)).padStart(2,0)}`;
			}
		},30);
	},
	template: /* html */`
		<div class="w-100 d-flex justify-content-between player">
			<div class="song-info text-white">
				<div>{{ song ? song.title : 'No song selected' }}</div>
				<p>{{ song ? song.artist : '' }}</p>
			</div>
			<div class="controls d-flex flex-column justify-content-center">
				<div class="btn-group">
					<button class="btn btn-secondary" title="Previous" @click="onPrevious"><i class="bi bi-skip-backward-fill"></i></button>
					<button class="btn btn-secondary" title="Play/Pause" @click="onPlayPause"><i class="bi" :class="[ isPlaying ? 'bi-pause-fill' : 'bi-play-fill' ]"></i></button>
					<button class="btn btn-secondary" title="Next" @click="onNext"><i class="bi bi-skip-forward-fill"></i></button>
				</div>
				<div class="d-flex gap-2 align-items-center">
					<div ref="songProgress" class="text-white"></div>
					<div class="progress flex-grow-1" @click="onProgressClicked">
						<div class="progress-bar" ref="playbackProgress"></div>
					</div>
					<div ref="songDuration" class="text-white"></div>
				</div>
			</div>
			<audio :src="url" preload="auto" ref="audio"></audio>
		</div>
	`
}