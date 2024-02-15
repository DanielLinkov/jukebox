<?php

namespace app\controllers;

use Yii;
use yii\filters\AccessControl;
use yii\web\Controller;
use yii\filters\VerbFilter;
use yii\helpers\FileHelper;
use getID3;

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
		$fileData = [];
		$getID3 = new getID3;
		foreach($fileList as $id=>$file) {
			switch(substr($file, strrpos($file,'.') + 1)){
				case 'mp3':
				case 'ogg':
					$fileInfo = $getID3->analyze($file);
					$getID3->CopyTagsToComments($fileInfo);
					$fileData[] = [
						'id'=>$id,
						'url'=>$mediaRootUrl . '/' . substr($file, strlen($mediaRootPath) + 1),
						'duration'=>$fileInfo['playtime_string'],
						'track'=>$fileInfo['comments']['track_number'][0] ?? NULL,
						'title'=>$fileInfo['comments']['title'][0] ?? NULL,
						'artist'=>$fileInfo['comments']['artist'][0] ?? NULL,
						'album'=>$fileInfo['comments']['album'][0] ?? NULL,
						'year'=>$fileInfo['comments']['year'][0] ?? NULL,
						'genre'=>$fileInfo['comments']['genre'][0] ?? NULL,
					];
					break;
			}
		}
		return $this->asJson(['list'=>$fileData]);
	}

}
