
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
		}
	},
	data(){
		return {
			song: null,
			url: null,
			isPlaying: false,
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
		}
	},
	mounted(){
		this.$refs.audio.addEventListener('canplay', () => {
			this.$refs.audio.play();
			this.isPlaying = true;
		});
		this.$refs.audio.addEventListener('play', () => {
			this.$emit('play');
		});
		this.$refs.audio.addEventListener('ended', () => {
			this.$emit('ended');
		});
	},
	template: /* html */`
		<div class="d-flex">
			<div class="btn-group me-2">
				<button class="btn btn-secondary" title="Previous" @click="onPrevious"><i class="bi bi-skip-backward-fill"></i></button>
				<button class="btn btn-secondary" title="Play/Pause" @click="onPlayPause"><i class="bi" :class="[ isPlaying ? 'bi-pause-fill' : 'bi-play-fill' ]"></i></button>
				<button class="btn btn-secondary" title="Next" @click="onNext"><i class="bi bi-skip-forward-fill"></i></button>
			</div>
			<audio :src="url" preload="auto" ref="audio"></audio>
		</div>
	`
}