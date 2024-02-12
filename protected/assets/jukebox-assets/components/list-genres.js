
export default{
	inject: ['allSongs'],
	data(){
		return {
			genres: [],
		}
	},
	created(){
		this.genres = new Set(this.allSongs.map(song => song.genre));	//Get unique genres
	},
	template: /* html */`
		<div>
			<h5>Genre</h5>
			<ul class="list-group">
				<li v-for="genre in genres" :key="genre" class="list-group-item">
					{{ genre }}
				</li>
			</ul>
		</div>
	`
}