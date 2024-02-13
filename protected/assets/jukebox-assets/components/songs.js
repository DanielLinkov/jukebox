
export default {
	props: ['songs'],
	template: /* html */`
		<table class="table table-striped">
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
				<tr v-for="song in songs" :key="song.id">
					<td>{{ song.track }}</td>
					<td>{{ song.title }}</td>
					<td>{{ song.genre }}</td>
					<td>{{ song.artist }}</td>
					<td>{{ song.album }}</td>
					<td><audio controls :src="song.url"></audio></td>
					<!--<td>{{ Math.floor(song.duration / 60) }}:{{ Math.floor(song.duration % 60) }}</td>-->
				</tr>
			</tbody>
		</table>
	`
}