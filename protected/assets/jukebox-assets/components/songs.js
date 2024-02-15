
export default {
	props: ['songs','currentSong'],
	emits: ['set-queue'],
	data(){
		return {
			selectedId: null,
			songsSorted: []
		}
	},
	watch: {
		songs: {
			immediate: true,
			handler(newVal){
				this.selectedId = null;
				this.songsSorted = newVal.sort((a,b) => {
					if(a.album != b.album)
						return a.album.localeCompare(b.album);
					return a.track - b.track
				});
			}
		}
	},
	methods: {
		setQueueToSongs(){
			const index = this.songsSorted.findIndex(song => song.id === this.selectedId);
			if(index === -1)
				return;
			const queue = this.songsSorted.slice(index);
			this.$emit('set-queue',queue,true);
		}
	},
	template: /* html */`
		<table class="table table-striped table-hover">
			<thead>
				<tr>
					<th scope="col" width="60">Track</th>
					<th scope="col">Title</th>
					<th scope="col">Genre</th>
					<th scope="col">Artist</th>
					<th scope="col">Album</th>
					<th scope="col" width="80">Duration</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="song in songsSorted" :key="song.id" @click="selectedId = song.id" @dblclick="setQueueToSongs" @touchstart="setQueueToSongs" class="song-row" :class="[ selectedId == song.id ? 'table-primary' : '',currentSong?.id == song.id ? 'playing' : '' ]">
					<td>{{ song.track }}</td>
					<td class="title">{{ song.title }}</td>
					<td>{{ song.genre }}</td>
					<td>{{ song.artist }}</td>
					<td>{{ song.album }}</td>
					<td class="text-end">{{ song.duration }}</td>
				</tr>
			</tbody>
		</table>
	`
}