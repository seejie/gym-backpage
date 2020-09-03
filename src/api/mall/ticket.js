import request from "@/utils/request";

const ticket = {
  url: '/shop/ticket',

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

const ticketAudit = {
  url: '/shop/ticket/audit',

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

const ticketCategory = {
  url: '/shop/ticket/category',

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

const ticketCode = {
  url: '/shop/ticket/code',

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

const ticketTag = {
  url: '/shop/ticket/tag',

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
  ticket,
  ticketAudit,
  ticketCategory,
  ticketCode,
  ticketTag,
};
