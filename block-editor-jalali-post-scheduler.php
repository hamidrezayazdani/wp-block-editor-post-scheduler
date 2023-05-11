<?php
/**
 * Plugin Name:       Block Editor Jalali post scheduler
 * Description:       This plugin replaces the default WordPress post scheduler with Jalali post scheduler.
 * Requires at least: 5.5
 * Requires PHP:      7.0
 * Version:           0.1.0
 * Author:            HamidReza Yazdani
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       block-editor-jalali-ps
 */

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/reference/functions/register_block_type/
 *
 * @return void
 */
function ywp_block_editor_jalali_post_scheduler_init() {
	register_block_type( __DIR__ . '/build' );
}

add_action( 'init', 'ywp_block_editor_jalali_post_scheduler_init' );

/**
 * Add stylesheet to bloc editor
 *
 * @return void
 */
function ywp_beps_enqueue_assets() {
	wp_enqueue_style( 'block-editor-jalali-post-scheduler', plugin_dir_url( __FILE__ ) . '/editor.css', array(), '0.1.0' );
}

add_action( 'enqueue_block_editor_assets', 'ywp_beps_enqueue_assets' );
