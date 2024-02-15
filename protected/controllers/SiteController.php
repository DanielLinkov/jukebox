<?php

namespace app\controllers;

use Yii;
use yii\filters\AccessControl;
use yii\web\Controller;
use yii\filters\VerbFilter;
use yii\helpers\FileHelper;
use app\helpers\FileInfo;
use app\models\Song;

class SiteController extends Controller
{
    /**
     * {@inheritdoc}
     */
    public function behaviors()
    {
        return [
            'access' => [
                'class' => AccessControl::class,
                'only' => ['logout'],
                'rules' => [
                    [
                        'actions' => ['logout'],
                        'allow' => true,
                        'roles' => ['@'],
                    ],
                ],
            ],
            'verbs' => [
                'class' => VerbFilter::class,
                'actions' => [
                    'logout' => ['post'],
                ],
            ],
        ];
    }

    /**
     * {@inheritdoc}
     */
    public function actions()
    {
        return [
            'error' => [
                'class' => 'yii\web\ErrorAction',
            ],
            'captcha' => [
                'class' => 'yii\captcha\CaptchaAction',
                'fixedVerifyCode' => YII_ENV_TEST ? 'testme' : null,
            ],
        ];
    }

    /**
     * Displays homepage.
     *
     * @return string
     */
    public function actionIndex()
    {
        return $this->render('index');
    }

	public function actionScan_media()
	{
		$mediaRootPath = Yii::getAlias('@media_root');
		$mediaRootUrl = Yii::getAlias('@media_url');
		$fileList = FileHelper::findFiles($mediaRootPath, ['only'=>['*.mp3','*.ogg','*.webm']], ['recursive'=>true]);
		Song::deleteAll();
		foreach($fileList as $id=>$file) {
			switch(substr($file, strrpos($file,'.') + 1)){
				case 'mp3':
				case 'ogg':
					$fileData = FileInfo::getData($file);
					// if($id == 1) return print_r($fileData,true);
					$song = new Song;
					$song->title = $fileData['title'];
					$song->track = $fileData['track'];
					$song->artist = $fileData['artist'];
					$song->album = $fileData['album'];
					$song->year = $fileData['year'];
					$song->genre = $fileData['genre'];
					$song->duration = $fileData['duration'];
					$song->url = $mediaRootUrl . '/' . substr($file, strlen($mediaRootPath) + 1);
					if(!$song->save())
						return $this->asJson(['error'=>$song->errors]);
					break;
			}
		}
		return $this->asJson(['status'=>'ok']);
	}
	public function actionFetch_songs()
	{
		$songs = Song::find()->asArray()->all();
		return $this->asJson(['status'=>'ok','songs'=>$songs]);
	}

}
