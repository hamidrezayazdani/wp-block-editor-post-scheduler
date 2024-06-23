import * as wpDate from "@wordpress/date";
import { __ } from '@wordpress/i18n';
import { Button } from '@wordpress/components';
import { registerPlugin } from '@wordpress/plugins';
import { PostScheduleCheck } from '@wordpress/editor';
import { PluginPostStatusInfo } from '@wordpress/edit-post';
import DatePicker from "react-multi-date-picker"
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import Toolbar from "react-multi-date-picker/plugins/toolbar"
import persian from "react-date-object/calendars/jalali"
import persian_fa from "react-date-object/locales/persian_fa"
import DateObject from "react-date-object";
import gregorian from "react-date-object/calendars/gregorian";
import gregorian_en from "react-date-object/locales/gregorian_en";

registerPlugin(
	'wpp-schedule-post',
	{
		render() {
			//date = date.convert(gregorian).format("YYYY-MM-DD HH:MM:SS")
			let postDate = wp.data.select('core/editor').getEditedPostAttribute('date')

			postDate = wpDate.gmdateI18n("Y/m/d H:i", postDate)

			const value = new DateObject({
				date: postDate,
				calendar: gregorian,
				locale: persian_fa,
				format: "YYYY/MM/DD HH:mm"
			}).convert(persian)
			//const captionValue =
			const weekDays = ["ش", "ی", "د", "س", "چ", "پ", "ج"]

			return (
				<PluginPostStatusInfo
					className="wpp-calendar-edit-post-post-schedule">
					<PostScheduleCheck>
						<label
							htmlFor={`wpp-calendar-edit-post-post-schedule__toggle`}
							id={`wpp-calendar-edit-post-post-schedule__heading`}
						>
							{__('Publish')}
						</label>
						<div style={{ direction: "rtl" }}>
							<DatePicker
								className="wpp-post-scheduler"
								portal={1}
								monthYearSeparator="‌"
								onChange={wppSetPostDate}
								format="DD MMMM YYYY HH:mm"
								plugins={[
									<TimePicker
										position="bottom"
										hideSeconds
									/>, <Toolbar
										position="bottom"
										sort={["close", "today"]}
										names={{
											today: __('Now'),
											close: __('Close')
										}}
									/>
								]}
								renderButton={<CustomButton />}
								calendar={persian}
								locale={persian_fa}
								value={value.setCalendar(persian).format("DD MMMM YYYY HH:mm")}
								weekDays={weekDays}
								mapDays={({ date }) => {
									let props = {}
									let isWeekend = [6].includes(date.weekDay.index)

									if (isWeekend) props.className = "highlight highlight-red"

									return props
								}}
								highlightToday={true}
								render={(value, openCalendar) => {
									return (
										<Button
											variant='tertiary'
											onClick={openCalendar}>
											{value}
										</Button>
									)
								}
								}
							>
							</DatePicker>
						</div>
					</PostScheduleCheck>
				</PluginPostStatusInfo>
			)
		}
	}
);

function wppSetPostDate(val) {
	let date = new DateObject({
		date: val.convert(gregorian),
		format: "YYYY-MM-DDTHH:mm:ss",
	});
	//date = date.convert(gregorian).format("YYYY-MM-DD HH:MM:SS")
	let postDate = date.set("calendar", gregorian).set("locale", gregorian_en).format()
	wp.data.dispatch('core/editor').editPost({ date: postDate })
}

function CustomButton({ direction, handleClick, disabled }) {
	return (
		<button
			className={direction === "right" ? "components-button is-tertiary has-icon wpp-right" : "components-button is-tertiary has-icon wpp-left"}
			onClick={handleClick}
		>
			{" "}
		</button>
	)
}

/**
 * Hack WordPress SlotFills
 *
 * Unfortunately, WordPress does not allow SlotFills to be placed in different positions.
 *
 * @code
 * https://github.com/WordPress/gutenberg/blob/8346327bcaeb3b85d9b9116eb3d226fa45a9876b/packages/edit-post/src/components/sidebar/post-status/index.js#L54
 *
 * document:
 * https://developer.wordpress.org/block-editor/reference-guides/slotfills/
 *
 * Therefore, after displaying the author box, we change the position of the calendar.
 *
 * @type {HTMLCollectionOf<Element>}
 */
//const authorBox = document.getElementsByClassName(('components-panel__row edit-post-post-author'))
const authorBox = document.getElementsByClassName(('post-author-selector'))

let onInitauthorBox = function () {
	return new Promise(function (resolve, reject) {
		function waitUntilauthorBoxRendered() {
			setTimeout(function () {
				if (authorBox.length > 0) {
					resolve(authorBox[0]);
				} else {
					waitUntilauthorBoxRendered();
				}
			}, 100);
		}

		waitUntilauthorBoxRendered();
	});
};

onInitauthorBox().then(function (el) {
	// Ensure that at least one element with the class exists
	const postScheduleDropdown = document.getElementsByClassName('editor-post-schedule__panel-dropdown');
	if (postScheduleDropdown.length > 0) {
		// Use the first element in the collection
		const targetElement = postScheduleDropdown[0];
		// Find the closest ancestor of the target element with the specified selector
		const closestAncestor = targetElement.closest('.components-flex.components-h-stack.editor-post-panel__row');
		if (closestAncestor) {
			closestAncestor.style.display = 'none';
		}
	}

	const visibilitySlot = document.getElementsByClassName('edit-post-post-visibility')
	const hstackVisibilitySlot = document.querySelectorAll('.components-flex.components-h-stack.editor-post-panel__row')
	const targetSlot = visibilitySlot.length > 0 ? visibilitySlot[0] : hstackVisibilitySlot[0]
	targetSlot.after(document.getElementsByClassName('wpp-calendar-edit-post-post-schedule')[0])
})
