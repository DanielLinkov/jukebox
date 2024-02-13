
export default {
	props: ['songs'],
	emits: ['play-song'],
	data(){
		return {
			selectedId: null
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
				<tr v-for="song in songs" :key="song.id" @click="selectedId = song.id" @dblclick="$emit('play-song',song.id);" class="song-row" :class="[ selectedId == song.id ? 'table-primary' : '' ]">
					<td>{{ String(song.track).split('/')[0] }}</td>
					<td>{{ song.title }}</td>
					<td>{{ song.genre }}</td>
					<td>{{ song.artist }}</td>
					<td>{{ song.album }}</td>
					<td class="text-end">{{ Math.floor(song.duration / 60) }}:{{ String(Math.floor(song.duration % 60)).padStart(2,0) }}</td>
				</tr>
			</tbody>
		</table>
	`
}