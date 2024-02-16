
export default {
	props: ['songs','currentSong'],
	emits: ['set-queue'],
	data(){
		return {
			selectedId: null,
			touchClicked: false,
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
		setQueueToSongs(event){
			this.selectedId = event.target.closest('tr').dataset.id;
			this.$emit('set-queue',this.songsSorted,this.selectedId);
		}
	},
	template: /* html */`
		<div class="table-responsive">
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
					<tr
						v-for="song in songsSorted"
						:key="song.id"
						@click="selectedId = song.id"
						@dblclick="setQueueToSongs"
						@touchstart="touchClick = true"
						@touchmove="touchClick = false"
						@touchend="touchClick && setQueueToSongs($event)"
						class="song-row"
						:class="[ selectedId == song.id ? 'table-primary' : '',currentSong?.id == song.id ? 'playing' : '' ]"
						:data-id="song.id"
					>
						<td>{{ song.track }}</td>
						<td class="title text-nowrap"><span @click="setQueueToSongs">{{ song.title }}</span></td>
						<td class="text-nowrap">{{ song.genre }}</td>
						<td class="text-nowrap">{{ song.artist }}</td>
						<td class="text-nowrap">{{ song.album }}</td>
						<td class="text-end">{{ song.duration }}</td>
					</tr>
				</tbody>
			</table>
		</div>
	`
}