
export default{
	emits: ['toggle-queue','play-song'],
	props: ['playQueue','currentSong'],
	data(){
		return {
			touchClick: false
		}
	},
	methods: {
		playSong(event){
			this.$emit('play-song',event.target.closest('tr').dataset.id);
		}
	},
	template: /* html */`
		<div id="queue" class="vh-100 overflow-y-auto pb-5">
			<button class="btn btn-primary position-absolute top-0 end-0 z-1" @click="$emit('toggle-queue')"><i class="bi bi-x-lg"></i></button>
			<h3 class="text-center position-sticky top-0 bg-body">Playing Queue</h3>
			<div class="table-responsive">
				<table class="table">
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
							v-for="song in playQueue"
							:key="song.id"
							@dblclick="playSong"
							@touchstart="touchClick = true"
							@touchmove="touchClick = false"
							@touchend="touchClick && playSong($event)"
							class="song-row"
							:class="[ currentSong?.id == song.id ? 'playing' : '' ]"
							:data-id="song.id"
						>
							<td>{{ song.track }}</td>
							<td class="title text-nowrap"><span @click="playSong">{{ song.title }}</span></td>
							<td class="text-nowrap">{{ song.genre }}</td>
							<td class="text-nowrap">{{ song.artist }}</td>
							<td class="text-nowrap">{{ song.album }}</td>
							<td class="text-end">{{ song.duration }}</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	`
}