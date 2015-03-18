<?php

	if (!class_exists('Timber')){
		add_action( 'admin_notices', function(){
			echo '<div class="error"><p>Timber not activated. Make sure you activate the plugin in <a href="' . admin_url('plugins.php#timber') . '">' . admin_url('plugins.php') . '</a></p></div>';
		});
		return;
	}

	class WPSite extends TimberSite {

		function __construct(){
			add_theme_support('post-thumbnails');
			add_theme_support('menus');
			add_filter('timber_context', array($this, 'add_to_context'));
			add_filter('get_twig', array($this, 'add_to_twig'));
			add_action('init', array($this, 'register_post_types'));
			add_action('init', array($this, 'register_taxonomies'));
			add_action('wp_print_styles', array($this, 'deregister_styles'));
			add_action('wp_print_scripts', array($this, 'deregister_scripts'));
			add_action( 'wp_print_scripts', array($this, 'current_jquery') );
			parent::__construct();
		}

		function register_post_types(){
			//this is where you can register custom post types
		}

		function register_taxonomies(){
			//this is where you can register custom taxonomies
		}

		function deregister_styles(){
			//this is where you can deregister unwanted styles
		}

		function deregister_scripts() {
			//this is where you can deregister unwanted scripts
		}

		/**
		 * This function will update your jQuery to the requested version and serve it from Googles Libraries
		 */
		function current_jquery() {
			global $wp_scripts;
			$version = '2.1.3';
			if ( ( version_compare($version, $wp_scripts -> registered['jquery'] -> ver) == 1 ) && !is_admin() ) {
				wp_deregister_script('jquery');

				wp_register_script('jquery',
					'http://ajax.googleapis.com/ajax/libs/jquery/'.$version.'/jquery.min.js',
					false, $version);
			}
		}

		/**
		 * Add more items to the context variable sent to the views
		 */
		function add_to_context($context){
			$context['menu'] = new TimberMenu('primary');
			$context['site'] = $this;
			return $context;
		}

		/**
		 * Add your own functions to Twig
		 */
		function add_to_twig($twig){
			$twig->addExtension(new Twig_Extension_StringLoader());
			return $twig;
		}

	}

	new WPSite();