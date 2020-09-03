import request from "@/utils/request";

const hotel = {
  url: '/shop/hotel',

  get(params) {
    return request({
      url: this.url,
      method: 'GET',
      params,
    });
  },

  getOne(id) {
    return request({
      url: `${this.url}/${id}`,
      method: 'GET',
    });
  },

  add(data) {
    return request({
      url: this.url,
      method: 'POST',
      data,
    });
  },

  update(data) {
    return request({
      url: this.url,
      method: 'PUT',
      data,
    });
  },

  remove(params) {
    const { ids } = params;

    const qs = ids.map((id) => `ids=${id}`);

    return request({
      url: `${this.url}?${qs.join('&')}`,
      method: 'DELETE',
    });
  },

  status(params) {
    const { ids, publishStatus } = params;

    const qs = ids.map((id) => `ids=${id}`);

    return request({
      url: `${this.url}/status?${qs.join('&')}&publishStatus=${publishStatus}`,
      method: 'PUT',
    });
  },

  stick(params) {
    const { id, stick } = params;

    return request({
      url: `${this.url}/stick/${id}?stick=${stick}`,
      method: 'PUT',
    });
  },
};

const hotelAudit = {
  url: '/shop/hotel/audit',

  get() {
    return request({
      url: this.url,
      method: 'GET',
    });
  },

  update(val) {
    return request({
      url: `${this.url}/${val}`,
      method: 'PUT',
    });
  },
};

const hotelCategory = {
  url: '/shop/hotel/cat',

  get(params) {
    return request({
      url: this.url,
      method: 'GET',
      params,
    });
  },

  add(data) {
    return request({
      url: this.url,
      method: 'POST',
      data,
    });
  },

  update(data) {
    return request({
      url: this.url,
      method: 'PUT',
      data,
    });
  },

  remove(id) {
    return request({
      url: `${this.url}/${id}`,
      method: 'DELETE',
    });
  },
};

const hotelBrand = {
  url: '/shop/hotel/brand',

  get(params) {
    return request({
      url: this.url,
      method: 'GET',
      params,
    });
  },

  add(data) {
    return request({
      url: this.url,
      method: 'POST',
      data,
    });
  },

  update(data) {
    return request({
      url: this.url,
      method: 'PUT',
      data,
    });
  },

  remove(params) {
    const { ids } = params;

    const qs = ids.map((id) => `ids=${id}`);

    return request({
      url: `${this.url}?${qs.join('&')}`,
      method: 'DELETE',
    });
  },
};

const hotelTag = {
  url: '/shop/hotel/tag',

  get(params) {
    return request({
      url: this.url,
      method: 'GET',
      params,
    });
  },

  add(data) {
    return request({
      url: this.url,
      method: 'POST',
      data,
    });
  },

  update(data) {
    return request({
      url: this.url,
      method: 'PUT',
      data,
    });
  },

  remove(params) {
    const { ids } = params;

    const qs = ids.map((id) => `ids=${id}`);

    return request({
      url: `${this.url}?${qs.join('&')}`,
      method: 'DELETE',
    });
  },
};

const hotelFacility = {
  url: '/shop/hotel/fac',

  get(params) {
    return request({
      url: this.url,
      method: 'GET',
      params,
    });
  },

  add(data) {
    return request({
      url: this.url,
      method: 'POST',
      data,
    });
  },

  update(data) {
    return request({
      url: this.url,
      method: 'PUT',
      data,
    });
  },

  remove(params) {
    const { ids } = params;

    const qs = ids.map((id) => `ids=${id}`);

    return request({
      url: `${this.url}?${qs.join('&')}`,
      method: 'DELETE',
    });
  },
};

export {
  hotel,
  hotelAudit,
  hotelCategory,
  hotelBrand,
  hotelTag,
  hotelFacility,
};
