<?php
namespace app\helpers;

use getID3;

class FileInfo{
	private static $getID3;
	public static function getData($file){
		if(!self::$getID3)
			self::$getID3 = new \getID3;
		try{
			$fileInfo = self::$getID3->analyze($file);
			self::$getID3->CopyTagsToComments($fileInfo);
		}catch(\Exception $e){
			return NULL;
		}
		return [
			'duration'=>$fileInfo['playtime_string'],
			'track'=>$fileInfo['comments']['track_number'][0] ?? NULL,
			'title'=>$fileInfo['comments']['title'][0] ?? NULL,
			'artist'=>$fileInfo['comments']['artist'][0] ?? NULL,
			'album'=>$fileInfo['comments']['album'][0] ?? NULL,
			'year'=>$fileInfo['comments']['year'][0] ?? NULL,
			'genre'=>$fileInfo['comments']['genre'][0] ?? NULL,
			// 'allInfo'=>$fileInfo
		];
	}
}