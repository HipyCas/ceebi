/**
 * Generated with json-ts (https://github.com/shakyShane/json-ts) and adapted to better match the general API response. You can view the response in a user-friendly JSON viewer at https://jsonhero.io/j/71I4d6XLKobM
 */

export interface IResponse {
  _edit_lock: string;
  _edit_last: string;
  label: string;
  category: string;
  location: string;
  organizer: string;
  tag: string;
  author: string;
  sf_status: string;
  sf_display_label: string;
  sf_reset_button: string;
  sf_refine: string;
  'sf-options': {
    list: IList;
    grid: IGrid;
    agenda: IAgenda;
    full_calendar: IFull_calendar;
    monthly_view: IMonthly_view;
    yearly_view: IYearly_view;
    map: IMap;
    daily_view: IDaily_view;
    weekly_view: IWeekly_view;
    timetable: ITimetable;
    tile: ITile;
    general_calendar: IGeneral_calendar;
  };
  skin: string;
  'sk-options': {
    list: IList;
    grid: IGrid;
    agenda: IAgenda;
    full_calendar: IFull_calendar;
    yearly_view: IYearly_view;
    monthly_view: IMonthly_view;
    map: IMap;
    daily_view: IDaily_view;
    weekly_view: IWeekly_view;
    timetable: ITimetable;
    masonry: IMasonry;
    cover: ICover;
    countdown: ICountdown;
    available_spot: IAvailable_spot;
    carousel: ICarousel;
    slider: ISlider;
    timeline: ITimeline;
    tile: ITile;
    general_calendar: IGeneral_calendar;
  };
  show_only_one_occurrence: string;
  show_past_events: string;
  show_only_past_events: string;
  show_ongoing_events: string;
  show_only_ongoing_events: string;
  ud_shortcode_login_status: string;
  content_json: IContent_json;
  content_html: string;
}

export interface ITypeField {
  type: string;
}

export interface ITypePlaceholderField {
  type: string;
  placeholder: string;
}

export interface IList {
  category?: ITypeField;
  location?: ITypeField;
  organizer?: ITypeField;
  speaker?: ITypeField;
  tag?: ITypeField;
  label?: ITypeField;
  address_search?: ITypePlaceholderField;
  event_cost?: ITypeField;
  month_filter?: ITypeField;
  time_filter?: ITypeField;
  text_search?: ITypePlaceholderField;
  style?: string;
  start_date_type?: string;
  start_date?: string;
  end_date_type?: string;
  maximum_date_range?: string;
  order_method?: string;
  classic_date_format1?: string;
  minimal_date_format1?: string;
  minimal_date_format2?: string;
  minimal_date_format3?: string;
  modern_date_format1?: string;
  modern_date_format2?: string;
  modern_date_format3?: string;
  standard_date_format1?: string;
  accordion_date_format1?: string;
  accordion_date_format2?: string;
  limit?: string;
  include_local_time?: string;
  include_events_times?: string;
  load_more_button?: string;
  month_divider?: string;
  display_label?: string;
  reason_for_cancellation?: string;
  display_categories?: string;
  display_organizer?: string;
  map_on_top?: string;
  set_geolocation?: string;
  set_geolocation_focus?: string;
  booking_button?: string;
  custom_data?: string;
  toggle_month_divider?: string;
  sed_method?: string;
  image_popup?: string;
}

export interface IGrid {
  category?: ITypeField;
  location?: ITypeField;
  organizer?: ITypeField;
  speaker?: ITypeField;
  tag?: ITypeField;
  label?: ITypeField;
  address_search?: ITypePlaceholderField;
  event_cost?: ITypeField;
  month_filter?: ITypeField;
  time_filter?: ITypeField;
  text_search?: ITypePlaceholderField;
  style?: string;
  start_date_type?: string;
  start_date?: string;
  end_date_type?: string;
  maximum_date_range?: string;
  order_method?: string;
  classic_date_format1?: string;
  clean_date_format1?: string;
  clean_date_format2?: string;
  minimal_date_format1?: string;
  minimal_date_format2?: string;
  modern_date_format1?: string;
  modern_date_format2?: string;
  modern_date_format3?: string;
  simple_date_format1?: string;
  colorful_date_format1?: string;
  colorful_date_format2?: string;
  colorful_date_format3?: string;
  novel_date_format1?: string;
  count?: string;
  limit?: string;
  include_local_time?: string;
  include_events_times?: string;
  load_more_button?: string;
  display_label?: string;
  reason_for_cancellation?: string;
  display_categories?: string;
  display_organizer?: string;
  map_on_top?: string;
  set_geolocation?: string;
  set_geolocation_focus?: string;
  booking_button?: string;
  custom_data?: string;
  sed_method?: string;
  image_popup?: string;
}

export interface IAgenda {
  category?: ITypeField;
  location?: ITypeField;
  organizer?: ITypeField;
  speaker?: ITypeField;
  tag?: ITypeField;
  label?: ITypeField;
  address_search?: ITypePlaceholderField;
  event_cost?: ITypeField;
  month_filter?: ITypeField;
  time_filter?: ITypeField;
  text_search?: ITypePlaceholderField;
  style?: string;
  start_date_type?: string;
  start_date?: string;
  end_date_type?: string;
  maximum_date_range?: string;
  order_method?: string;
  clean_date_format1?: string;
  clean_date_format2?: string;
  limit?: string;
  include_local_time?: string;
  display_label?: string;
  reason_for_cancellation?: string;
  load_more_button?: string;
  month_divider?: string;
  booking_button?: string;
  custom_data?: string;
  sed_method?: string;
  image_popup?: string;
}

export interface IFull_calendar {
  category?: ITypeField;
  location?: ITypeField;
  organizer?: ITypeField;
  speaker?: ITypeField;
  tag?: ITypeField;
  label?: ITypeField;
  address_search?: ITypePlaceholderField;
  event_cost?: ITypeField;
  month_filter?: ITypeField;
  time_filter?: ITypeField;
  text_search?: ITypePlaceholderField;
  start_date_type?: string;
  start_date?: string;
  default_view?: string;
  monthly_style?: string;
  limit?: string;
  list?: string;
  date_format_list?: string;
  end_date_type_list?: string;
  maximum_date_range_list?: string;
  order_method_list?: string;
  grid?: string;
  end_date_type_grid?: string;
  maximum_date_range_grid?: string;
  order_method_grid?: string;
  tile?: string;
  yearly?: string;
  date_format_yearly_1?: string;
  date_format_yearly_2?: string;
  monthly?: string;
  activate_first_date?: string;
  activate_current_day?: string;
  weekly?: string;
  daily?: string;
  display_price?: string;
  display_label?: string;
  reason_for_cancellation?: string;
  include_local_time?: string;
  booking_button?: string;
  custom_data?: string;
  sed_method?: string;
  image_popup?: string;
}

export interface IMonthly_view {
  category?: ITypeField;
  location?: ITypeField;
  organizer?: ITypeField;
  speaker?: ITypeField;
  tag?: ITypeField;
  label?: ITypeField;
  address_search?: ITypePlaceholderField;
  event_cost?: ITypeField;
  month_filter?: ITypeField;
  time_filter?: ITypeField;
  text_search?: ITypePlaceholderField;
  style?: string;
  start_date_type?: string;
  start_date?: string;
  limit?: string;
  include_local_time?: string;
  next_previous_button?: string;
  display_label?: string;
  reason_for_cancellation?: string;
  activate_first_date?: string;
  activate_current_day?: string;
  display_all?: string;
  booking_button?: string;
  custom_data?: string;
  detailed_time?: string;
  sed_method?: string;
  image_popup?: string;
}

export interface IYearly_view {
  category?: ITypeField;
  location?: ITypeField;
  organizer?: ITypeField;
  speaker?: ITypeField;
  tag?: ITypeField;
  label?: ITypeField;
  address_search?: ITypePlaceholderField;
  event_cost?: ITypeField;
  month_filter?: ITypeField;
  time_filter?: ITypeField;
  text_search?: ITypePlaceholderField;
  style?: string;
  start_date_type?: string;
  start_date?: string;
  modern_date_format1?: string;
  modern_date_format2?: string;
  limit?: string;
  months?: IMonths;
  include_local_time?: string;
  next_previous_button?: string;
  display_label?: string;
  reason_for_cancellation?: string;
  booking_button?: string;
  custom_data?: string;
  sed_method?: string;
  image_popup?: string;
}

export interface IMap {
  category?: ITypeField;
  location?: ITypeField;
  organizer?: ITypeField;
  speaker?: ITypeField;
  tag?: ITypeField;
  label?: ITypeField;
  address_search?: ITypePlaceholderField;
  event_cost?: ITypeField;
  month_filter?: ITypeField;
  text_search?: ITypePlaceholderField;
  start_date_type?: string;
  start_date?: string;
  limit?: string;
  geolocation?: string;
  geolocation_focus?: string;
}

export interface IDaily_view {
  category?: ITypeField;
  location?: ITypeField;
  organizer?: ITypeField;
  speaker?: ITypeField;
  tag?: ITypeField;
  label?: ITypeField;
  address_search?: ITypePlaceholderField;
  event_cost?: ITypeField;
  month_filter?: ITypeField;
  time_filter?: ITypeField;
  text_search?: ITypePlaceholderField;
  start_date_type?: string;
  start_date?: string;
  limit?: string;
  include_local_time?: string;
  next_previous_button?: string;
  display_label?: string;
  reason_for_cancellation?: string;
  display_categories?: string;
  display_organizer?: string;
  booking_button?: string;
  custom_data?: string;
  detailed_time?: string;
  sed_method?: string;
  image_popup?: string;
}

export interface IWeekly_view {
  category?: ITypeField;
  location?: ITypeField;
  organizer?: ITypeField;
  speaker?: ITypeField;
  tag?: ITypeField;
  label?: ITypeField;
  address_search?: ITypePlaceholderField;
  event_cost?: ITypeField;
  month_filter?: ITypeField;
  time_filter?: ITypeField;
  text_search?: ITypePlaceholderField;
  start_date_type?: string;
  start_date?: string;
  limit?: string;
  include_local_time?: string;
  display_label?: string;
  reason_for_cancellation?: string;
  display_categories?: string;
  display_organizer?: string;
  next_previous_button?: string;
  booking_button?: string;
  custom_data?: string;
  detailed_time?: string;
  sed_method?: string;
  image_popup?: string;
}

export interface ITimetable {
  category?: ITypeField;
  location?: ITypeField;
  organizer?: ITypeField;
  speaker?: ITypeField;
  tag?: ITypeField;
  label?: ITypeField;
  address_search?: ITypePlaceholderField;
  event_cost?: ITypeField;
  month_filter?: ITypeField;
  time_filter?: ITypeField;
  text_search?: ITypePlaceholderField;
  style?: string;
  start_date_type?: string;
  start_date?: string;
  limit?: string;
  number_of_days_modern?: string;
  number_of_days?: string;
  week_start?: string;
  start_time?: string;
  end_time?: string;
  include_local_time?: string;
  display_label?: string;
  reason_for_cancellation?: string;
  next_previous_button?: string;
  booking_button?: string;
  custom_data?: string;
  sed_method?: string;
  image_popup?: string;
}

export interface ITile {
  category?: ITypeField;
  location?: ITypeField;
  organizer?: ITypeField;
  speaker?: ITypeField;
  tag?: ITypeField;
  label?: ITypeField;
  address_search?: ITypePlaceholderField;
  event_cost?: ITypeField;
  month_filter?: ITypeField;
  time_filter?: ITypeField;
  text_search?: ITypePlaceholderField;
  start_date_type?: string;
  start_date?: string;
  clean_date_format1?: string;
  clean_date_format2?: string;
  count?: string;
  display_label?: string;
  reason_for_cancellation?: string;
  display_categories?: string;
  display_organizer?: string;
  next_previous_button?: string;
  limit?: string;
  load_more_button?: string;
  booking_button?: string;
  custom_data?: string;
  sed_method?: string;
  image_popup?: string;
}

export interface IGeneral_calendar {
  category?: ITypeField;
  location?: ITypeField;
  organizer?: ITypeField;
  speaker?: ITypeField;
  tag?: ITypeField;
  label?: ITypeField;
  address_search?: ITypePlaceholderField;
  event_cost?: ITypeField;
  month_filter?: ITypeField;
  text_search?: ITypePlaceholderField;
  start_date_type?: string;
  start_date?: string;
  more_event?: string;
  include_local_time?: string;
  display_label?: string;
  reason_for_cancellation?: string;
  sed_method?: string;
  image_popup?: string;
}

export interface IMonths {
  1: string;
  2: string;
  3: string;
  4: string;
  5: string;
  6: string;
  7: string;
  8: string;
  9: string;
  10: string;
  11: string;
  12: string;
}

export interface IMasonry {
  start_date_type: string;
  start_date: string;
  end_date_type: string;
  maximum_date_range: string;
  order_method: string;
  date_format1: string;
  date_format2: string;
  limit: string;
  filter_by: string;
  include_local_time: string;
  display_label: string;
  reason_for_cancellation: string;
  display_categories: string;
  display_organizer: string;
  fit_to_row: string;
  masonry_like_grid: string;
  load_more_button: string;
  booking_button: string;
  custom_data: string;
  sed_method: string;
  image_popup: string;
}

export interface ICover {
  style: string;
  date_format_clean1: string;
  date_format_clean2: string;
  date_format_clean3: string;
  date_format_classic1: string;
  date_format_classic2: string;
  date_format_modern1: string;
  event_id: string;
  include_local_time: string;
  display_label: string;
  reason_for_cancellation: string;
}

export interface ICountdown {
  style: string;
  date_format_style11: string;
  date_format_style21: string;
  date_format_style31: string;
  date_format_style32: string;
  date_format_style33: string;
  event_id: string;
  bg_color: string;
  include_local_time: string;
  display_label: string;
  reason_for_cancellation: string;
}

export interface IAvailable_spot {
  date_format1: string;
  date_format2: string;
  event_id: string;
  include_local_time: string;
  display_label: string;
  reason_for_cancellation: string;
}

export interface ICarousel {
  style: string;
  start_date_type: string;
  start_date: string;
  type1_date_format1: string;
  type1_date_format2: string;
  type1_date_format3: string;
  type2_date_format1: string;
  type3_date_format1: string;
  count: string;
  count_tablet: string;
  count_mobile: string;
  limit: string;
  autoplay_status: string;
  autoplay: string;
  loop_status: string;
  booking_button: string;
  custom_data: string;
  archive_link: string;
  head_text: string;
  include_local_time: string;
  include_events_times: string;
  display_label: string;
  reason_for_cancellation: string;
  sed_method: string;
  image_popup: string;
}

export interface ISlider {
  style: string;
  start_date_type: string;
  start_date: string;
  type1_date_format1: string;
  type1_date_format2: string;
  type1_date_format3: string;
  type2_date_format1: string;
  type2_date_format2: string;
  type2_date_format3: string;
  type3_date_format1: string;
  type3_date_format2: string;
  type3_date_format3: string;
  type4_date_format1: string;
  type4_date_format2: string;
  type4_date_format3: string;
  type5_date_format1: string;
  type5_date_format2: string;
  type5_date_format3: string;
  limit: string;
  autoplay: string;
  transition_time: string;
  include_local_time: string;
  display_label: string;
  reason_for_cancellation: string;
  custom_data: string;
}

export interface ITimeline {
  start_date_type: string;
  start_date: string;
  end_date_type: string;
  maximum_date_range: string;
  order_method: string;
  classic_date_format1: string;
  limit: string;
  include_local_time: string;
  display_label: string;
  reason_for_cancellation: string;
  display_categories: string;
  display_organizer: string;
  load_more_button: string;
  month_divider: string;
  booking_button: string;
  custom_data: string;
  sed_method: string;
  image_popup: string;
}

export interface IContent_json {
  [date: string]: IDateContent[]; // TODO Date has format yyyy-mm-dd
}

export interface IDateContent {
  ID: number;
  data: IData;
  date: IDate;
}

export interface IData {
  ID: number;
  title: string;
  content: string;
  post: IPost;
  meta: IMeta;
  mec: IMec;
  time: ITime;
  hourly_schedules: IHourlySchedulesItem[];
  tickets: any[];
  color: string;
  permalink: string;
  thumbnails: IThumbnails;
  featured_image: IFeatured_image;
  locations: Record<`${number}`, ILocation>;
  categories: ICategories;
  tags: ITypeFields;
  fields: IFieldsItem[];
  TZO: ITZO;
  speakers: ISpeakers;
}

export interface IPost {
  ID: number;
  post_author: string;
  post_date: string;
  post_date_gmt: string;
  post_content: string;
  post_title: string;
  post_excerpt: string;
  post_status: string;
  comment_status: string;
  ping_status: string;
  post_password: string;
  post_name: string;
  to_ping: string;
  pinged: string;
  post_modified: string;
  post_modified_gmt: string;
  post_content_filtered: string;
  post_parent: number;
  guid: string;
  menu_order: number;
  post_type: string;
  post_mime_type: string;
  comment_count: string;
  filter: string;
}

export interface IMeta {
  mec_color: string;
  mec_location_id: string;
  mec_dont_show_map: string;
  mec_organizer_id: string;
  mec_read_more: string;
  mec_more_info: string;
  mec_more_info_title: string;
  mec_more_info_target: string;
  mec_cost: string;
  mec_currency: any[];
  mec_additional_organizer_ids: any[];
  mec_additional_location_ids: any[];
  mec_date: IMec_date;
  mec_repeat: IRepeat;
  mec_certain_weekdays: any[];
  mec_allday: string;
  mec_hide_time: string;
  mec_hide_end_time: string;
  mec_comment: string;
  mec_timezone: string;
  mec_countdown_method: string;
  mec_public: string;
  mec_start_date: string;
  mec_start_time_hour: string;
  mec_start_time_minutes: string;
  mec_start_time_ampm: string;
  mec_start_day_seconds: string;
  mec_end_date: string;
  mec_end_time_hour: string;
  mec_end_time_minutes: string;
  mec_end_time_ampm: string;
  mec_end_day_seconds: string;
  mec_repeat_status: string;
  mec_repeat_type: string;
  mec_repeat_interval: string;
  mec_repeat_end: string;
  mec_repeat_end_at_occurrences: string;
  mec_repeat_end_at_date: string;
  mec_advanced_days: any[];
  mec_in_days: string;
  mec_not_in_days: string;
  mec_hourly_schedules: IMecHourlySchedulesItem[];
  mec_booking: IMec_booking;
  mec_tickets: any[];
  mec_fees_global_inheritance: string;
  mec_fees: any[];
  mec_ticket_variations_global_inheritance: string;
  mec_ticket_variations: any[];
  mec_reg_fields_global_inheritance: string;
  mec_reg_fields: any[];
  mec_bfixed_fields: any[];
  mec_op: IMec_op;
  mec_fields: IMec_fields;
  mec_event_status: string;
  mec_moved_online_link: string;
  mec_cancelled_reason: string;
  mec_display_cancellation_reason_in_single_page: string;
  mec_cost_auto_calculate: string;
  mec_start_datetime: string;
  mec_end_datetime: string;
  mec_sequence: string;
  event_past: boolean;
  _yoast_wpseo_primary_mec_category?: string;
}

export interface IMec_date {
  start: IDateSpec;
  end: IDateSpec;
  comment: string;
  repeat: IRepeat;
}

export interface IDateSpec {
  date: string;
  hour: number | string;
  minutes: string;
  ampm: string;
  timestamp?: number;
}

export interface IRepeat {
  type: string;
  interval: string;
  advanced: string;
  end: string;
  end_at_date: string;
  end_at_occurrences: string;
}

export interface IMec_booking {
  bookings_limit_unlimited: string;
  bookings_limit: string;
  bookings_minimum_per_booking: string;
  roles_discount_administrator: string;
  roles_discount_editor: string;
  roles_discount_author: string;
  roles_discount_contributor: string;
  roles_discount_subscriber: string;
  roles_discount_asistente: string;
  roles_discount_customer: string;
  roles_discount_shop_manager: string;
  roles_discount_voluntario?: string;
  bookings_all_occurrences: string;
  bookings_all_occurrences_multiple: string;
  show_booking_form_interval: string;
  stop_selling_after_first_occurrence: string;
  auto_verify: string;
  auto_confirm: string;
  last_few_tickets_percentage_inherit: string;
  last_few_tickets_percentage: string;
  thankyou_page_inherit: string;
  booking_thankyou_page: string;
  booking_thankyou_page_time: string;
  bookings_user_limit_unlimited: string;
  bookings_user_limit: string;
  gateways_5_disabled: string;
  bookings_limit_for_users: string;
}

export interface IMec_op {
  [x: `${number}`]: IMec_opData;
}

export interface IMec_opData {
  secret_key: string;
  publishable_key: string;
}

export interface IMec_fields {
  [x: `${number}`]: string;
}

export interface IMec {
  id: string;
  post_id: string;
  start: string;
  end: string;
  repeat: string;
  rinterval: null;
  year: null;
  month: null;
  day: null;
  week: null;
  weekday: null;
  weekdays: null;
  days: string;
  not_in_days: string;
  time_start: string;
  time_end: string;
}

export interface ITime {
  start: string;
  end: string;
  start_raw: string;
  end_raw: string;
  start_timestamp: number;
  end_timestamp: number;
}

export interface IThumbnails {
  thumbnail: string;
  thumblist: string;
  gridsquare: string;
  meccarouselthumb: string;
  medium: string;
  large: string;
  full: string;
  tileview: string;
}

export interface IFeatured_image {
  thumbnail: string;
  thumblist: string;
  gridsquare: string;
  meccarouselthumb: string;
  medium: string;
  large: string;
  full: string;
  tileview: string;
}

export interface ILocation {
  id: number;
  name: string;
  address: string;
  latitude: string;
  longitude: string;
  url: string;
  thumbnail: string;
}

export interface ICategories {
  [x: number]: ICategory;
}

export interface ICategory {
  id: number;
  name: string;
  icon: string;
  color: string;
}

export interface ITypeFields {
  290: I290;
}

export interface I290 {
  id: number;
  name: string;
}

export interface IFieldsItem {
  id: number;
  type: string;
  label: string;
  value: string;
}

export interface ITZO {
  timezone_type: number;
  timezone: string;
}

export interface IDate {
  start: IDateSpec;
  end: IDateSpec;
}

export interface I29 {
  id: number;
  name: string;
  icon: string;
  color: string;
}

export type ISpeakers = Record<string, ISpeaker>;

export interface ISpeaker {
  id: number;
  name: string;
  job_title: string;
  tel: string;
  email: string;
  facebook: string;
  twitter: string;
  gplus: string;
  thumbnail: string;
}

export interface I23 {
  id: number;
  name: string;
  address: string;
  latitude: string;
  longitude: string;
  url: string;
  thumbnail: string;
}

export interface I31 {
  id: number;
  name: string;
  icon: string;
  color: string;
}

export interface I302 {
  id: number;
  name: string;
  job_title: string;
  tel: string;
  email: string;
  facebook: string;
  twitter: string;
  gplus: string;
  thumbnail: string;
}

export interface I42 {
  id: number;
  name: string;
  address: string;
  latitude: string;
  longitude: string;
  url: string;
  thumbnail: string;
}

export interface I28 {
  id: number;
  name: string;
  icon: string;
  color: string;
}

export interface I301 {
  id: number;
  name: string;
  job_title: string;
  tel: string;
  email: string;
  facebook: string;
  twitter: string;
  gplus: string;
  thumbnail: string;
}

export interface I272 {
  id: number;
  name: string;
  job_title: string;
  tel: string;
  email: string;
  facebook: string;
  twitter: string;
  gplus: string;
  thumbnail: string;
}

export interface I56 {
  id: number;
  name: string;
  job_title: string;
  tel: string;
  email: string;
  facebook: string;
  twitter: string;
  gplus: string;
  thumbnail: string;
}

export interface I211 {
  id: number;
  name: string;
  job_title: string;
  tel: string;
  email: string;
  facebook: string;
  twitter: string;
  gplus: string;
  thumbnail: string;
}

export interface I243 {
  id: number;
  name: string;
  job_title: string;
  tel: string;
  email: string;
  facebook: string;
  twitter: string;
  gplus: string;
  thumbnail: string;
}

export interface I213 {
  id: number;
  name: string;
  job_title: string;
  tel: string;
  email: string;
  facebook: string;
  twitter: string;
  gplus: string;
  thumbnail: string;
}

export interface I286 {
  id: number;
  name: string;
  job_title: string;
  tel: string;
  email: string;
  facebook: string;
  twitter: string;
  gplus: string;
  thumbnail: string;
}

export interface I32 {
  id: number;
  name: string;
  icon: string;
  color: string;
}

export interface I27 {
  id: number;
  name: string;
  icon: string;
  color: string;
}

export interface I282 {
  id: number;
  name: string;
  job_title: string;
  tel: string;
  email: string;
  facebook: string;
  twitter: string;
  gplus: string;
  thumbnail: string;
}

export interface I50 {
  id: number;
  name: string;
  address: string;
  latitude: string;
  longitude: string;
  url: string;
  thumbnail: string;
}

export interface I39 {
  id: number;
  name: string;
  icon: string;
  color: string;
}

export interface I38 {
  id: number;
  name: string;
  icon: string;
  color: string;
}

export interface IMecHourlySchedulesItem {
  title: string;
  schedules: ISchedules;
}

export interface ISchedules {
  1: I1;
  2: I2;
  3: I3;
}

export interface I1 {
  from: string;
  to: string;
  title: string;
  description: string;
}

export interface I2 {
  from: string;
  to: string;
  title: string;
  description: string;
}

export interface I3 {
  from: string;
  to: string;
  title: string;
  description: string;
}

export interface IHourlySchedulesItem {
  title: string;
  schedules: ISchedules;
}

export interface I35 {
  id: number;
  name: string;
  icon: string;
  color: string;
}

export interface I37 {
  id: number;
  name: string;
  icon: string;
  color: string;
}

export interface I36 {
  id: number;
  name: string;
  icon: string;
  color: string;
}

export interface I159 {
  id: number;
  name: string;
  job_title: string;
  tel: string;
  email: string;
  facebook: string;
  twitter: string;
  gplus: string;
  thumbnail: string;
}

export interface I299 {
  id: number;
  name: string;
  job_title: string;
  tel: string;
  email: string;
  facebook: string;
  twitter: string;
  gplus: string;
  thumbnail: string;
}

export interface I178 {
  id: number;
  name: string;
  job_title: string;
  tel: string;
  email: string;
  facebook: string;
  twitter: string;
  gplus: string;
  thumbnail: string;
}

export interface I57 {
  id: number;
  name: string;
  job_title: string;
  tel: string;
  email: string;
  facebook: string;
  twitter: string;
  gplus: string;
  thumbnail: string;
}

export interface I244 {
  id: number;
  name: string;
  job_title: string;
  tel: string;
  email: string;
  facebook: string;
  twitter: string;
  gplus: string;
  thumbnail: string;
}

export interface I261 {
  id: number;
  name: string;
  job_title: string;
  tel: string;
  email: string;
  facebook: string;
  twitter: string;
  gplus: string;
  thumbnail: string;
}

export interface I241 {
  id: number;
  name: string;
  job_title: string;
  tel: string;
  email: string;
  facebook: string;
  twitter: string;
  gplus: string;
  thumbnail: string;
}

export interface I214 {
  id: number;
  name: string;
  job_title: string;
  tel: string;
  email: string;
  facebook: string;
  twitter: string;
  gplus: string;
  thumbnail: string;
}

export interface I215 {
  id: number;
  name: string;
  job_title: string;
  tel: string;
  email: string;
  facebook: string;
  twitter: string;
  gplus: string;
  thumbnail: string;
}

export interface I242 {
  id: number;
  name: string;
  job_title: string;
  tel: string;
  email: string;
  facebook: string;
  twitter: string;
  gplus: string;
  thumbnail: string;
}

export interface I285 {
  id: number;
  name: string;
  job_title: string;
  tel: string;
  email: string;
  facebook: string;
  twitter: string;
  gplus: string;
  thumbnail: string;
}

export interface I26 {
  id: number;
  name: string;
  icon: string;
  color: string;
}

export interface I303 {
  id: number;
  name: string;
  address: string;
  latitude: string;
  longitude: string;
  url: string;
  thumbnail: string;
}
