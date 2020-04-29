<?php
/**
 * Main functions file.
 *
 * @package ht_bongda_01
 * @author TruongHT <giang.truong.ht@gmail.com>
 * @since 1.0
 */

/**
 * Load option tree.
 */
require_once get_template_directory() . '/inc/option-tree/ot-loader.php';
// require_once get_template_directory() . '/inc/theme-options.php';
add_filter( 'ot_theme_mode', '__return_true' );

// Source: https://wpcolt.com/fix-hentry-errors-wordpress/
function remove_hentry( $class ) {
	$class = array_diff( $class, array( 'hentry' ) );
	return $class;
}
add_filter( 'post_class', 'remove_hentry' );

/**
 * Load ht story.
 */
// require_once get_template_directory() . '/inc/ht-story/ht-story.php';

/**
 * Load ht rating.
 */
// require_once get_template_directory() . '/inc/ht-rating/ht-rating.php';


/**
 * Load ht rating.
 */
// require_once get_template_directory() . '/inc/ht-football/ht-football.php';


/**
 * Load ht view.
 */
//require_once get_template_directory() . '/inc/ht-view/class-ht-view.php';


/**
 * Custom thumbnail.
 */
//require_once get_template_directory() . '/inc/awe-thumbnail/init.php';


/**
 * Load meta box.
 */
require_once get_template_directory() . '/inc/meta-boxes.php';


/**
 * Load extra functions.
 */
require_once get_template_directory() . '/inc/extra.php';


/**
 * Load template tags.
 */
require_once get_template_directory() . '/inc/template-tags.php';


/**
 * Custom league manager plugin.
 */
// require_once get_template_directory() . '/inc/league-manager.php';


require_once( get_template_directory() . '/inc/Tax-meta-class/Tax-meta-class.php' );


require_once( get_template_directory() . '/inc/widgets.php' );


require_once( get_template_directory() . '/inc/ht-ads/ht-ads.php' );

//require_once( get_template_directory() . '/inc/shortcode/ht-football-page.php' );


$ht_posted = array();

if ( ! isset( $content_width ) ) {
	$content_width = 640;
}

// Disable API
// add_filter( 'rest_authentication_errors', 'ultimatewoo_disable_rest_api' );
// function ultimatewoo_disable_rest_api( $access ) {
// return new WP_Error( 'rest_disabled', __( 'The REST API on this site has been disabled.' ), array( 'status' => rest_authorization_required_code() ) );
// }
// 
// 

// Enable the option show in rest
add_filter( 'acf/rest_api/field_settings/show_in_rest', '__return_true' );

// Enable the option edit in rest
add_filter( 'acf/rest_api/field_settings/edit_in_rest', '__return_true' );

add_filter( 'acf/rest_api/item_permissions/get', function( $permission ) {
  return current_user_can( 'edit_users' );
} );


add_filter( 'rest_prepare_post', 'dt_use_raw_post_content', 10, 3 );
function dt_use_raw_post_content( $data, $post, $request ) {
    	$data->data['content']['plaintext'] = $post->post_content;
	$data->data['title']['plaintitle'] = htmlspecialchars_decode($post->post_title, ENT_QUOTES);
	$data->data['excerpt']['custom_excerpt'] = get_post_meta($post->ID, 'ht_excerpt', true);
	preg_match_all('/< *img[^>]*src *= *["\']?([^"\']*)/i', $post->post_content, $match );
	$src = array_pop($match);
	$data->data['content']['images'] = $src;
	$data->data['total_comments'] = wp_count_comments($post->ID);
	$data->data['source_link'] = get_post_meta($post->ID, 'ht_iframe_url', true);
	$data->data['thumb'] = get_post_meta($post->ID, 'ht_iframe_thumb', true);
	$data->data['featured_post'] = get_post_meta($post->ID, 'ht_featured', true);
	$data->data['taxonomy_source'] = get_the_terms($post->ID, 'source' );
		
    return $data;
}

add_filter( 'rest_prepare_notification', 'dt_use_raw_notification_content', 10, 3 );
function dt_use_raw_notification_content( $data, $notification, $request ) {
    $data->data['content']['plaintext'] = $notification->post_content;
	$data->data['title']['plaintitle'] = htmlspecialchars_decode($notification->post_title, ENT_QUOTES);
    return $data;
}

add_filter( 'rest_prepare_comment', function( $response, $comment, $request ) { 

    $response->data['custom_avatar'] = get_user_meta( $comment->user_id, 'custom_avatar', true); 

    return $response; 
}, 10, 3 );


// Add custom columns to Admin users list
add_action('manage_users_columns', 'add_custom_users_columns', 10, 1 );
function add_custom_users_columns( $columns ) {
    unset($columns['posts']);

    $columns['account_displayName'] = __('Display Name');

    return $columns;
}


// fetching the displayName
add_filter('manage_users_custom_column',  'add_data_to_custom_users_columns', 10, 3);
function add_data_to_custom_users_columns( $value, $column_name, $user_id ) {
    if( 'account_displayName' == $column_name ) {
        $user = get_userdata( $user_id );
        $display_name = $user->display_name;

        $value = '<span style="color:green;font-weight:bold;">' . $display_name . '</span>';
    }

    return $value;
}

add_filter( 'rest_prepare_user', function( $response, $user, $request ) {

    $response->data['email'] = $user->user_email;
	$xu = get_user_meta( $user->ID, 'mycred_default', true );
	if(empty($xu)) {
		$response->data['xu'] = '0';
	} else {
		$response->data['xu'] = $xu;
	}

    $response->data['rewarded_ads_should_enable'] = true;
    $rewarded_ads_next_turn = get_user_meta( $user->ID, 'rewarded_ads_next_turn', true );
    $response->data['rewarded_ads_next_turn'] = $rewarded_ads_next_turn;
    if(!empty($rewarded_ads_next_turn)) {
        $current = new DateTime();
        $rewarded_ads_next_turn = new DateTime($rewarded_ads_next_turn);

        if($current > $rewarded_ads_next_turn) {
            $response->data['rewarded_ads_should_enable'] = true;
        } else {
            $response->data['rewarded_ads_should_enable'] = false;
        }
    }

	$response->data['fbToken'] = get_user_meta( $user->ID, 'fbToken', true );
	$response->data['phoneToken'] = get_user_meta( $user->ID, 'phoneToken', true );
	$response->data['phoneNumber'] = get_user_meta( $user->ID, 'phoneNumber', true );
	$response->data['exp'] = get_user_meta( $user->ID, 'mycred_exp', true );
	$response->data['exp_rank'] = mycred_get_users_rank($user->ID, 'mycred_exp');
	$response->data['daily_limit'] = get_user_meta($user->ID, 'daily_limit');
	$response->data['invitedFriends'] = get_user_meta($user->ID, 'invitedFriends')[0];
	$response->data['subscribed'] = get_user_meta( $user->ID, 'subscribed', true );
	$response->data['custom_avatar'] = get_user_meta( $user->ID, 'custom_avatar', true );
	$response->data['gender'] = get_user_meta( $user->ID, 'gender', true );
	$response->data['birth_date'] = get_user_meta( $user->ID, 'birth_date', true );
	$response->data['so_thich'] = get_user_meta( $user->ID, 'so_thich', true );
	$response->data['user_email'] = get_user_meta( $user->ID, 'user_email', true );
	$response->data['mobile_number'] = get_user_meta( $user->ID, 'mobile_number', true );

    return $response;

}, 10, 3 );



if( ! function_exists( 'post_meta_request_params' ) ) :
	function post_meta_request_params( $args, $request )
	{
		$args += array(
			'meta_key'   => $request['meta_key'],
			'meta_value' => $request['meta_value'],
			'meta_query' => $request['meta_query'],
		);
	    return $args;
	}
	add_filter( 'rest_post_query', 'post_meta_request_params', 99, 2 );
endif;

add_action( 'init', 'my_custom_taxonomy_rest_support', 25 );
  function my_custom_taxonomy_rest_support() {
  	global $wp_taxonomies;
  
  	//be sure to set this to the name of your taxonomy!
  	$taxonomy_name = 'source';
  
  	if ( isset( $wp_taxonomies[ $taxonomy_name ] ) ) {
  		$wp_taxonomies[ $taxonomy_name ]->show_in_rest = true;
  		$wp_taxonomies[ $taxonomy_name ]->rest_base = $taxonomy_name;
  		$wp_taxonomies[ $taxonomy_name ]->rest_controller_class = 'WP_REST_Terms_Controller';
  	}
  
  
  }

add_action( 'rest_api_init', function () {
	register_rest_route( 'wp/v2', '/current_user/', array(
		'methods' => 'GET',
		'callback' => 'my_user',
	) );
	register_rest_route( 'wp/v2', '/add_xu/', array(
		'methods' => 'GET',
		'callback' => 'add_xu_func',
	) );
	register_rest_route( 'wp/v2', '/add_exp/', array(
		'methods' => 'GET',
		'callback' => 'add_exp_func',
	) );
	register_rest_route( 'wp/v2', '/update_user_info/', array(
		'methods' => 'POST',
		'callback' => 'update_user_info',
	) );
	register_rest_route( 'wp/v2', '/add_user_subscription/', array(
		'methods' => 'GET',
		'callback' => 'add_user_subscription',
	) );
	register_rest_route( 'wp/v2', '/update_user_subscription/', array(
		'methods' => 'POST',
		'callback' => 'update_user_subscription',
	) );
	register_rest_route( 'wp/v2', '/delete_user_subscription/', array(
		'methods' => 'POST',
		'callback' => 'delete_user_subscription',
	) );
	register_rest_route( 'wp/v2', '/get_source_logo/', array(
		'methods' => 'GET',
		'callback' => 'get_source_logo',
	) );
	register_rest_route( 'wp/v2', '/get_hobby_choices/', array(
		'methods' => 'GET',
		'callback' => 'get_hobby_choices',
	) );
	register_rest_route( 'wp/v2', '/get_trending_hear/', array(
		'methods' => 'GET',
		'callback' => 'get_trending_hear',
	) );
	register_rest_route( 'wp/v2', '/get_menus/', array(
		'methods' => 'GET',
		'callback' => 'get_menus',
	) );
	register_rest_route( 'wp/v2', '/update_user_avatar/', array(
		'methods' => 'POST',
		'callback' => 'update_user_avatar',
	) );
	register_rest_route( 'wp/v2', '/update_user_fbToken/', array(
		'methods' => 'POST',
		'callback' => 'update_user_fbToken',
	) );
	register_rest_route( 'wp/v2', '/update_user_phoneToken/', array(
		'methods' => 'POST',
		'callback' => 'update_user_phoneToken',
	) );
	register_rest_route( 'wp/v2', '/update_user_phoneNumber/', array(
		'methods' => 'POST',
		'callback' => 'update_user_phoneNumber',
	) );
	register_rest_route( 'wp/v2', '/invited_friend/', array(
		'methods' => 'POST',
		'callback' => 'invited_friend',
	) );
} );

function my_user( $data ) {
    return get_currentuserinfo();
}

function add_xu_func(WP_REST_Request $request) {
	$amount = (int)$request->get_param( 'ammount' );
	$user_id = (int)$request->get_param( 'id' );
	$action_type = (string)$request->get_param( 'action_type' );

	if($action_type) {
        if($action_type == 'watch_rewarded_ads') {
            setRewardedAdsNextTurn($user_id)
        }
	}

	return mycred_add( 'xu', $user_id, $amount, 'development' );
}

function setRewardedAdsNextTurn($user_id) {
    $dt = new DateTime();
    $minutes_to_add = 5;

    $dt->add(new DateInterval('PT' . $minutes_to_add . 'M'));

    $stamp = $dt->format('Y-m-d H:i');

	update_user_meta($user_id, 'rewarded_ads_next_turn', $stamp);
}


function add_exp_func(WP_REST_Request $request) {
	
    $amount = (int)$request->get_param( 'ammount' );
	$user_id = (int)$request->get_param( 'id' );
	$action_type = (string)$request->get_param( 'action_type' );
	// The individual sets of parameters are also available, if needed:
	if($action_type) {
		checkExpDailyLimit($user_id, $amount, $action_type);
	} else {
		ExpAddAndCheckRank($amount, $user_id);
	}
	
	return $amount;
}

function checkExpDailyLimit($user_id, $ammount, $action_type) {
	$today = date_i18n( 'Y-m-d' );
	
	$daily_limit = get_user_meta($user_id, 'daily_limit')[0];
	
	if(empty($daily_limit)) {
 		$daily_limit =	array( 'reading' => (object)[$today => '0'],
							  'comments' => (object)[$today => '0'],
							  'social_sharing' => (object)[$today => '0'] );
	}
	
	if(!empty($daily_limit[$action_type]->$today)) {
		$activity_daily_limit;

		if($action_type == 'reading' || $action_type == 'comments') {
			$activity_daily_limit = 3;
		} else if ($action_type == 'social_sharing') {
			$activity_daily_limit = 4;
		} else {
			$activity_daily_limit = 999;
		}

		$count = (int) $daily_limit[$action_type]->$today;

		if($count < $activity_daily_limit) {
			$count++;
			$daily_limit[$action_type]->$today = $count; 

			ExpAddAndCheckRank($ammount, $user_id);

			update_user_meta($user_id, 'daily_limit', $daily_limit);
		}

	}
	else {
		$daily_limit[$action_type] = (object)[];
		$daily_limit[$action_type]->$today = 1;

		ExpAddAndCheckRank($ammount, $user_id);

		update_user_meta($user_id, 'daily_limit', $daily_limit);
	}
		
	
}

function ExpAddAndCheckRank($ammount, $user_id) {
	$prev_exp = get_user_meta( $user_id, 'mycred_exp', true );
	mycred_add( 'exp', $user_id, $ammount, 'development', 0 ,'','mycred_exp');
	$after_exp = get_user_meta( $user_id, 'mycred_exp', true );
	
	$exp_milestones = array(101, 251, 451, 701, 1001, 2501, 4501, 7001, 10001, 15001, 25001, 35001, 45001, 50001, 60001, 70001, 85001); 
	$rewarded_xu_milestones = array(5, 10, 10, 10, 10, 20, 20, 20, 20, 50, 50, 50, 50, 100, 100, 100, 500);
	
	$i = 0;
	foreach ($exp_milestones as $rank_milestone) {	
		if(($prev_exp < $rank_milestone) && ($after_exp >= $rank_milestone)) {
			$text = 'ranking up from ';
			$current_rank = mycred_get_users_rank($user_id, 'mycred_exp');
			$rank_string = (string) $current_rank->title;
			$string = $text.$rank_string;
			
			mycred_add('xu', $user_id, $rewarded_xu_milestones[$i], $string );
		}
		
		$i++;
	}
	
}

function add_user_subscription(WP_REST_Request $request) {
	$user_id = get_current_user_id();
	$a = array();
	return add_user_meta( $user_id, 'subscribed', $a, true);
}
function update_user_subscription(WP_REST_Request $request) {
	$user_id = get_current_user_id();
	$parameters = $request->get_body_params();
	$a = get_user_meta($user_id, 'subscribed', true);
	
	if($a == null){
		$a = array();
	}
	
	if(!in_array($parameters['source'], $a)) {
		array_push($a, $parameters['source']);
	}
	
	return update_user_meta( $user_id, 'subscribed', $a);
}
function delete_user_subscription(WP_REST_Request $request) {
	$user_id = get_current_user_id();
	$parameters = $request->get_body_params();
	$a = get_user_meta($user_id, 'subscribed', true);
	$exclude = array($parameters['source']);
	$filtered = array_diff($a, $exclude);
	return update_user_meta( $user_id, 'subscribed', $filtered);
}
function update_user_info(WP_REST_Request $request) {
	$user_id = get_current_user_id();
	$parameters = $request->get_body_params();
	
	$user_obj = wp_get_current_user();
	$user_obj->data->display_name = $parameters['name'];

	wp_update_user($user_obj->data);
	update_user_meta( $user_id, 'gender' ,$parameters['gender']);
	update_user_meta( $user_id, 'so_thich' ,$parameters['so_thich']);
	update_user_meta( $user_id, 'mobile_number' ,$parameters['mobile_number']);
	update_user_meta( $user_id, 'birth_date' ,$parameters['birth_date']);
	update_user_meta( $user_id, 'user_email' ,$parameters['user_email']);
	return "sended";
}
function get_source_logo(WP_REST_Request $request) {
	
	if (function_exists( 'ot_get_option' ))
	{
		$str = mb_convert_encoding($request->get_param( 'link' ), "UTF-7", "EUC-JP");
		$logo = ot_get_option( 'ht_source_link', array() );
		$array = array_values($logo);
		function filter_callback($element) {
		  if ( strcmp($element['title'], $str) == 0) {
			return TRUE;
		  }
		  return FALSE;
		}

		$arr = array_filter($array, 'filter_callback');
		return $array;
	}
	
}
function get_hobby_choices(WP_REST_Request $request) {
    $array = array("Cà phê", "Nghe nhạc", "Xem phim", "Đá bóng");
    return $array;
}
function get_trending_hear(WP_REST_Request $request) {
	
	if (function_exists( 'ot_get_option' ))
	{
		$trending = ot_get_option( 'trending_hear', array() );
		$array = array_values($trending);
		
		return $array;
	}
	
}
function get_menus(WP_REST_Request $request) {
	$menuLocations = get_nav_menu_locations();
	$menuID = $menuLocations['primary'];	
	$primaryNav = wp_get_nav_menu_items($menuID);
	return $primaryNav;	
}
function update_user_avatar(WP_REST_Request $request) {
	
	$user_id = get_current_user_id();
	$parameters = $request->get_body_params();
	return update_user_meta( $user_id, 'custom_avatar', $parameters['avatar_url']); 	
}

function update_user_fbToken(WP_REST_Request $request) {
	
	$user_id = get_current_user_id();
	$parameters = $request->get_body_params();
	return update_user_meta( $user_id, 'fbToken', $parameters['fbToken']); 	
}

function update_user_phoneToken(WP_REST_Request $request) {
	
	$user_id = get_current_user_id();
	$parameters = $request->get_body_params();
	return update_user_meta( $user_id, 'phoneToken', $parameters['phoneToken']); 	
}
function update_user_phoneNumber(WP_REST_Request $request) {
	
	$user_id = get_current_user_id();
	$parameters = $request->get_body_params();
	return update_user_meta( $user_id, 'phoneNumber', $parameters['phoneNumber']); 	
}
function invited_friend(WP_REST_Request $request) {
	$parameters = $request->get_body_params();
	$owner = get_user_meta( $parameters['owner_id'], 'invitedFriends', true );
	
	if($owner == null) {
		$owner = array();
	}
	
	$invited_id = $parameters['user_id'];
	array_push($owner, $invited_id);
		
	return update_user_meta( $parameters['owner_id'], 'invitedFriends', $owner); 
}
add_filter( 'rest_query_vars', function ( $valid_vars ) {
    return array_merge( $valid_vars, array( 'shareToken', 'meta_query' ) );
} );
add_filter( 'rest_query_vars', function ( $valid_vars ) {
    return array_merge( $valid_vars, array( 'fbToken', 'meta_query' ) );
} );
add_filter( 'rest_query_vars', function ( $valid_vars ) {
    return array_merge( $valid_vars, array( 'phoneToken', 'meta_query' ) );
} );
add_filter( 'rest_user_query', function( $args, $request ) {
    $shareToken   = $request->get_param( 'shareToken' );
    $fbToken   = $request->get_param( 'fbToken' );
    $phoneToken   = $request->get_param( 'phoneToken' );

    if ( ! empty( $shareToken ) ) {
        $args['meta_query'] = array(
            array(
                'key'     => 'shareToken',
                'value'   => $shareToken,
                'compare' => '=',
            )
        );      
    }
    if ( ! empty( $fbToken ) ) {
        $args['meta_query'] = array(
            array(
                'key'     => 'fbToken',
                'value'   => $fbToken,
                'compare' => '=',
            )
        );      
    }
    if ( ! empty( $phoneToken ) ) {
        $args['meta_query'] = array(
            array(
                'key'     => 'phoneToken',
                'value'   => $phoneToken,
                'compare' => '=',
            )
        );      
    }

    return $args;
}, 10, 2 );
add_filter( 'rest_user_query', 'prefix_remove_has_published_posts_from_wp_api_user_query', 10, 2 );
/**
 * Removes `has_published_posts` from the query args so even users who have not
 * published content are returned by the request.
 *
 * @see https://developer.wordpress.org/reference/classes/wp_user_query/
 *
 * @param array           $prepared_args Array of arguments for WP_User_Query.
 * @param WP_REST_Request $request       The current request.
 *
 * @return array
 */
function prefix_remove_has_published_posts_from_wp_api_user_query( $prepared_args, $request ) {
	unset( $prepared_args['has_published_posts'] );

	return $prepared_args;
}


/**
 * This functions file after setup theme, before init hook.
 *
 * @since 1.0
 */
function ht_bongda_01_setup() {

	load_theme_textdomain( 'ht-bongda-01', get_template_directory() . '/languages' );

	add_theme_support( 'automatic-feed-links' );

	add_theme_support( 'title-tag' );

	add_theme_support( 'post-thumbnails' );

	register_nav_menus( array(
		'primary' => __( 'Primary Menu', 'ht-bongda-01' ),
		'primary-mobile' => __( 'Primary Mobile Menu', 'ht-bongda-01' ),
		'footer'  => __( 'Footer Menu', 'ht-bongda-01' ),
		'cat-menu'  => __( 'Sticky Menu', 'ht-bongda-01' ),
	) );

	add_theme_support( 'post-formats', array( 'video' ) );

}
add_action( 'after_setup_theme', 'ht_bongda_01_setup' );


/**
 * Register widget area.
 *
 * @since 1.0
 *
 * @link https://codex.wordpress.org/Function_Reference/register_sidebar
 */
function ht_bongda_01_widgets_init() {
	register_sidebar( array(
		'name'          => __( 'Main Sidebar', 'ht_bongda_01' ),
		'id'            => 'home-sidebar',
		'before_widget' => '<div id="%1$s" class="widget %2$s">',
		'after_widget'  => '</div>',
		'before_title'  => '<h2 class="widget-title">',
		'after_title'   => '</h2>',
	) );

	register_sidebar( array(
		'name'          => __( 'Archive Sidebar', 'ht_bongda_01' ),
		'id'            => 'archive-sidebar',
		'before_widget' => '<div id="%1$s" class="widget %2$s">',
		'after_widget'  => '</div>',
		'before_title'  => '<h2 class="widget-title">',
		'after_title'   => '</h2>',
	) );

	register_sidebar( array(
		'name'          => __( 'Single Sidebar', 'ht_bongda_01' ),
		'id'            => 'single-sidebar',
		'before_widget' => '<div id="%1$s" class="widget %2$s">',
		'after_widget'  => '</div>',
		'before_title'  => '<h4 class="widget-title">',
		'after_title'   => '</h4>',
	) );

	register_sidebar( array(
		'name'          => __( 'Footer Sidebar', 'ht_bongda_01' ),
		'id'            => 'footer-sidebar',
		'before_widget' => '<div class="col-md-2 col-sm-4 col-xs-6"><div id="%1$s" class="widget %2$s">',
		'after_widget'  => '</div></div>',
		'before_title'  => '<h4 class="widget-title">',
		'after_title'   => '</h4>',
	) );
}
add_action( 'widgets_init', 'ht_bongda_01_widgets_init' );


/**
 * Enqueue google fonts.
 *
 * @return void
 * @since 1.0
 */
function ht_bongda_01_google_fonts() {
	$query_args = array(
		'family' => 'Roboto+Condensed:400,700',
		'subset' => 'latin,vietnamese',
	);
	wp_register_style( 'google-fonts', add_query_arg( $query_args, '//fonts.googleapis.com/css' ), array() );
}
add_action( 'wp_enqueue_scripts', 'ht_bongda_01_google_fonts' );


/**
 * Load css and js.
 *
 * @since 1.0
 */
function ht_bongda_01_scripts() {
	$version = '1.1';

	wp_register_style( 'font-awesome', get_template_directory_uri() . '/assets/css/font-awesome.min.css', array(), '4.3.0' );
	wp_register_style( 'ht-bongda-01', get_template_directory_uri() . '/assets/css/main.css', array(), $version );
	wp_register_style( 'ht-bongda-01-image', get_template_directory_uri() . '/assets/css/image.css', array(), $version );
	wp_register_style( 'ht-bongda-01-sportspress', get_template_directory_uri() . '/assets/css/sportspress.css', array(), $version );

	$custom_css = '';
	if ( ot_get_option( 'ht_custom_css' ) ) {
		$custom_css = ot_get_option( 'ht_custom_css' );
	}
	wp_add_inline_style( 'ht-bongda-01', $custom_css );

	wp_register_script( 'bootstrap', get_template_directory_uri() . '/assets/js/lib/bootstrap.min.js', array( 'jquery' ), '3.3.4', true );
	wp_register_script( 'theia-sticky-sidebar', get_template_directory_uri() . '/assets/js/lib/theia-sticky-sidebar.js', array( 'jquery' ), '1.3.0', true );
	wp_register_script( 'ht-bongda-01', get_template_directory_uri() . '/assets/js/main.js', array( 'jquery' ), $version, true );

	wp_enqueue_style( 'font-awesome' );
	wp_enqueue_style( 'ht-bongda-01' );
	wp_enqueue_style( 'ht-bongda-01-image' );
	wp_enqueue_style( 'ht-bongda-01-sportspress' );

	if ( is_single() && ht_bongda_01_is_iframe_post() ) {
		// wp_enqueue_style( 'ht-bongda-01-iframe' );
	}

	wp_enqueue_script( 'bootstrap' );
	wp_enqueue_script( 'theia-sticky-sidebar' );
	wp_enqueue_script( 'ht-bongda-01' );
}
add_action( 'wp_enqueue_scripts', 'ht_bongda_01_scripts' );

function remove_unused_image_size( $sizes) {
 
   unset( $sizes['thumbnail']);
   unset( $sizes['medium']);
   unset( $sizes['large']);

}
add_filter('intermediate_image_sizes_advanced', 'remove_unused_image_size');

/**
 * Only display story in search result.
 *
 * @param  WP_Query $query Query to filter.
 *
 * @return WP_Query
 * @since 1.0.0
 */
function ht_bongda_01_filter_search_result( $query ) {
	if ( $query->is_search() && $query->is_main_query() ) {
		$query->set( 'post_type', 'post' );
	}
	return $query;
}
add_action( 'pre_get_posts', 'ht_bongda_01_filter_search_result' );


/**
 * Register facebook javascript sdk.
 *
 * @return void
 * @since 1.0.0
 */
function ht_bongda_01_facebook_js_sdk() {
	if ( ! is_singular( 'post' ) ) {
		return;
	}

	if ( ot_get_option( 'fb_app_id' ) ) {
		?>
		<div id="fb-root"></div>
		<script>(function(d, s, id) {
		  var js, fjs = d.getElementsByTagName(s)[0];
		  if (d.getElementById(id)) return;
		  js = d.createElement(s); js.id = id;
		  js.src = "//connect.facebook.net/vi_VN/sdk.js#xfbml=1&version=v2.5&appId=<?php echo esc_js( ot_get_option( 'fb_app_id' ) ); ?>";
		  fjs.parentNode.insertBefore(js, fjs);
		}(document, 'script', 'facebook-jssdk'));</script>
		<?php
	}
}
add_action( 'wp_footer', 'ht_bongda_01_facebook_js_sdk' );


/**
 * Add meta app id and meta admin to moderate facebook sdk.
 *
 * @return void
 * @since 1.0.0
 */
function ht_bongda_01_facebook_admin() {
	if ( ! is_singular( 'post' ) ) {
		return;
	}

	if ( ot_get_option( 'fb_app_id' ) ) {
		echo '<meta property="fb:app_id" content="' . esc_attr( ot_get_option( 'fb_app_id' ) ) . '" />';
	}
	$fb_admin = ot_get_option( 'fb_admin_id' );
	if ( ! empty( $fb_admin ) && is_array( $fb_admin ) ) {
		foreach ( $fb_admin as $v ) {
			echo '<meta property="fb:admins" content="' . esc_attr( $v['id'] ) . '"/>';
		}
	}
}
add_action( 'wp_head', 'ht_bongda_01_facebook_admin' );


/**
 * Enqueue CSS & JS for single chapter page.
 *
 * @return void
 * @since 1.0.0
 */
function ht_bongda_01_iframe_script() {
	if ( ! is_singular( 'chapter' ) ) {
		return;
	}
	wp_enqueue_style( 'ht-bongda-01-iframe', get_template_directory_uri() . '/css/iframe.css' );
	wp_enqueue_script( 'ht-bongda-01-iframe', get_template_directory_uri() . '/js/iframe.js', array(), false, true );
}
add_action( 'wp_enqueue_scripts', 'ht_bongda_01_iframe_script' );


/**
 * Print HTML in footer on single chapter page.
 *
 * @return void
 * @since 1.0.0
 */
function ht_bongda_01_chapter_footer() {
	if ( ! is_singular( 'chapter' ) ) {
		return;
	}
	echo '<a id="iframe-comment-icon" href="' . esc_url( get_permalink( HT_Story_Helper::get_chapter_story( get_the_ID() ) ) . '#fb-comment' ) . '"><i class="fa fa-comments fa-3x"></i></a>';
}
add_action( 'wp_footer', 'ht_bongda_01_chapter_footer' );


if ( ! class_exists( 'ht_bongda_01_Primary_Menu_Walker' ) ) {

	/**
	 * Class ht_bongda_01_Primary_Menu_Walker to reimplement nav menu.
	 *
	 * @since 1.0.0
	 */
	class ht_bongda_01_Primary_Menu_Walker extends Walker_Nav_Menu {

		/**
		 * Starts the list before the elements are added.
		 *
		 * @see Walker::start_lvl()
		 *
		 * @since 3.0.0
		 *
		 * @param string $output Passed by reference. Used to append additional content.
		 * @param int    $depth  Depth of menu item. Used for padding.
		 * @param array  $args   An array of arguments.
		 * @see wp_nav_menu()
		 */
		public function start_lvl( &$output, $depth = 0, $args = array() ) {
			$indent = str_repeat( "\t", $depth );
			$output .= "\n$indent<ul class=\"sub-menu dropdown-menu\">\n";
		}


		/**
		 * Start the element output.
		 *
		 * @see Walker::start_el()
		 *
		 * @since 3.0.0
		 *
		 * @param string $output Passed by reference. Used to append additional content.
		 * @param object $item   Menu item data object.
		 * @param int    $depth  Depth of menu item. Used for padding.
		 * @param array  $args   An array of arguments. @see wp_nav_menu().
		 * @param int    $id     Current item ID.
		 */
		public function start_el( &$output, $item, $depth = 0, $args = array(), $id = 0 ) {
			$indent = ( $depth ) ? str_repeat( "\t", $depth ) : '';

			$classes = empty( $item->classes ) ? array() : (array) $item->classes;
			$classes[] = 'menu-item-' . $item->ID;

			$has_child = false;
			if ( in_array( 'menu-item-has-children', $classes ) ) {
				$has_child = true;
			}

			if ( $has_child ) {
				$classes[] = 'dropdown';
			}

			/**
			 * Filter the CSS class(es) applied to a menu item's list item element.
			 *
			 * @since 3.0.0
			 * @since 4.1.0 The `$depth` parameter was added.
			 *
			 * @param array  $classes The CSS classes that are applied to the menu item's `<li>` element.
			 * @param object $item    The current menu item.
			 * @param array  $args    An array of {@see wp_nav_menu()} arguments.
			 * @param int    $depth   Depth of menu item. Used for padding.
			 */
			$class_names = join( ' ', apply_filters( 'nav_menu_css_class', array_filter( $classes ), $item, $args, $depth ) );
			$class_names = $class_names ? ' class="' . esc_attr( $class_names ) . '"' : '';

			/**
			 * Filter the ID applied to a menu item's list item element.
			 *
			 * @since 3.0.1
			 * @since 4.1.0 The `$depth` parameter was added.
			 *
			 * @param string $menu_id The ID that is applied to the menu item's `<li>` element.
			 * @param object $item    The current menu item.
			 * @param array  $args    An array of {@see wp_nav_menu()} arguments.
			 * @param int    $depth   Depth of menu item. Used for padding.
			 */
			$id = apply_filters( 'nav_menu_item_id', 'menu-item-'. $item->ID, $item, $args, $depth );
			$id = $id ? ' id="' . esc_attr( $id ) . '"' : '';

			$output .= $indent . '<li' . $id . $class_names .'>';

			$atts = array();
			$atts['title']  = ! empty( $item->attr_title ) ? $item->attr_title : '';
			$atts['target'] = ! empty( $item->target )     ? $item->target     : '';
			$atts['rel']    = ! empty( $item->xfn )        ? $item->xfn        : '';
			$atts['href']   = ! empty( $item->url )        ? $item->url        : '';

			if ( $has_child ) {
				$atts['class'] = 'dropdown-toggle';
				$atts['data-toggle'] = 'dropdown';
			}

			/**
			 * Filter the HTML attributes applied to a menu item's anchor element.
			 *
			 * @since 3.6.0
			 * @since 4.1.0 The `$depth` parameter was added.
			 *
			 * @param array $atts {
			 *     The HTML attributes applied to the menu item's `<a>` element, empty strings are ignored.
			 *
			 *     @type string $title  Title attribute.
			 *     @type string $target Target attribute.
			 *     @type string $rel    The rel attribute.
			 *     @type string $href   The href attribute.
			 * }
			 * @param object $item  The current menu item.
			 * @param array  $args  An array of {@see wp_nav_menu()} arguments.
			 * @param int    $depth Depth of menu item. Used for padding.
			 */
			$atts = apply_filters( 'nav_menu_link_attributes', $atts, $item, $args, $depth );

			$attributes = '';
			foreach ( $atts as $attr => $value ) {
				if ( ! empty( $value ) ) {
					$value = ( 'href' === $attr ) ? esc_url( $value ) : esc_attr( $value );
					$attributes .= ' ' . $attr . '="' . $value . '"';
				}
			}

			$item_output = $args->before;
			$item_output .= '<a'. $attributes .'>';
			/** This filter is documented in wp-includes/post-template.php */
			$item_output .= $args->link_before . apply_filters( 'the_title', $item->title, $item->ID ) . $args->link_after;

			if ( $has_child ) {
				$item_output .= '<b class="caret"></b>';
			}

			$item_output .= '</a>';
			$item_output .= $args->after;

			/**
			 * Filter a menu item's starting output.
			 *
			 * The menu item's starting output only includes `$args->before`, the opening `<a>`,
			 * the menu item's title, the closing `</a>`, and `$args->after`. Currently, there is
			 * no filter for modifying the opening and closing `<li>` for a menu item.
			 *
			 * @since 3.0.0
			 *
			 * @param string $item_output The menu item's starting HTML output.
			 * @param object $item        Menu item data object.
			 * @param int    $depth       Depth of menu item. Used for padding.
			 * @param array  $args        An array of {@see wp_nav_menu()} arguments.
			 */
			$output .= apply_filters( 'walker_nav_menu_start_el', $item_output, $item, $depth, $args );
		}
	}
}


if ( ! function_exists( 'ht_bongda_01_the_content' ) ) {
	/**
	 * Print content for archive post.
	 *
	 * @return void
	 * @since 1.0.0
	 */
	function ht_bongda_01_the_content() {
		if ( has_excerpt() ) {
			the_excerpt();
		} else {
			echo wp_kses_post( wp_trim_words( get_the_content(), 20, '...' ) );
		}
	}
}

// add_filter( 'rest_{type}_query', function( $args ) {
// 	$args['meta_query'] = array(
// 		array(
// 			'key'   => 'tag',
// 			'value' => esc_sql( $_GET['tag'] ),
// 		)
// 	);

// 	return $args;
// } );


////////////////////////////////////////////////////////////////////////
// Ultimate Member Profile Display Name Integration ////////////////////
////////////////////////////////////////////////////////////////////////
add_filter('wpdiscuz_comment_author', 'wpdiscuz_um_author', 10, 2);
function wpdiscuz_um_author($author_name, $comment) {
    if ($comment->user_id) {
        $column = 'display_name'; // Other options: 'user_login', 'user_nicename', 'nickname', 'first_name', 'last_name'
        if (class_exists('UM_API') || class_exists('UM')) {
            um_fetch_user($comment->user_id); $author_name = um_user($column); um_reset_user();
        } else {
            $author_name = get_the_author_meta($column, $comment->user_id);
        }
    }
    return $author_name;
}
////////////////////////////////////////////////////////////////////////
// Ultimate Member Profile URL Integration /////////////////////////////
////////////////////////////////////////////////////////////////////////
add_filter('wpdiscuz_profile_url', 'wpdiscuz_um_profile_url', 10, 2);
function wpdiscuz_um_profile_url($profile_url, $user) {
    if ($user && (class_exists('UM_API') || class_exists('UM'))) {
        um_fetch_user($user->ID); $profile_url = um_user_profile_url();
    }
    return $profile_url;
}
////////////////////////////////////////////////////////////////////////
// MyCred User Ranks and Badges Integration ////////////////////////////
////////////////////////////////////////////////////////////////////////
add_filter('wpdiscuz_after_label', 'wpdiscuz_mc_after_label_html', 110, 2);
function wpdiscuz_mc_after_label_html($afterLabelHtml, $comment) {
    if ($comment->user_id) {
        if (function_exists('mycred_get_users_rank')) { //User Rank
            $afterLabelHtml .= mycred_get_users_rank($comment->user_id, 'logo', 'post-thumbnail', array('class' => 'mycred-rank'));
        }
        if (function_exists('mycred_get_users_badges')) { //User Badges
            $users_badges = mycred_get_users_badges($comment->user_id);
            if (!empty($users_badges)) {
                foreach ($users_badges as $badge_id => $level) {
                    $imageKey = ( $level > 0 ) ? 'level_image' . $level : 'main_image';
                    $afterLabelHtml .= '<img src="' . get_post_meta($badge_id, $imageKey, true) . '" width="22" height="22" class="mycred-badge earned" alt="' . get_the_title($badge_id) . '" title="' . get_the_title($badge_id) . '" />';
                }
            }
        }        
    }
    return $afterLabelHtml;
}
