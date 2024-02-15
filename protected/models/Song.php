<?php

namespace app\models;

class Song extends \yii\db\ActiveRecord
{
	public static function tableName()
	{
		return 'song';
	}
}