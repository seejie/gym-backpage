import request from "@/utils/request";

const  customCourseList={
  url:"/customCourse/course/",
  load(params){
    return request({
      url: this.url+'searchCustomCoursePage',
      method: 'GET',
      params
    });
  },
  getone(params){
    return request({
      url: this.url+'findCustomCourseById',
      method: 'GET',
      params
    });
  },
  add(data){
    return request({
      url: this.url+'createCustomCourse',
      method: 'POST',
      data
    });
  },
  update(data){
    return request({
      url: this.url+'updateCustomCourse/'+data.id,
      method: 'POST',
      data
    });
  },
  delete(data){
    return request({
      url: this.url+'deleteCustomCourse',
      method: 'POST',
      data
    });
  },
  approveCoursePackage(data){
    return request({
      url: this.url+'approveCoursePackage',
      method: 'POST',
      data
    });
  },
  record(params){
    return request({
      url: this.url+'getCourseStudentsPage',
      method: 'GET',
      params
    });
  },
  exportCourseStudents(params){
    return request({
      url: this.url+'exportCourseStudents',
      method: 'GET',
      params
    });
  },
  createUpdateCourseInstructions(data){
    return request({
      url: this.url+'createUpdateCourseInstructions',
      method: 'POST',
      data
    });
  }
};

const packages = {
  url:'/customCourse/package/',
  load(params){
    return request({
      url: this.url+'searchPackagePage',
      method: 'GET',
      params
    });
  },
  findCustomCoursePackageById(params){
    return request({
      url: this.url+'findCustomCoursePackageById',
      method: 'GET',
      params
    });
  },
  createPackage(data){
    return request({
      url: this.url+'createPackage',
      method: 'POST',
      data
    });
  },
  updatePackage(data){
    return request({
      url: this.url+'updatePackage/'+data.id,
      method: 'POST',
      data
    });
  },
  approveCustomCoursePackage(data){
    return request({
      url: this.url+'approveCustomCoursePackage',
      method: 'POST',
      data
    });
  },
  deletePackage(data){
    return request({
      url: this.url+'deletePackage',
      method: 'POST',
      data
    });
  },
};
const customCourseCategory = {
  url: '/customCourse/customCourseCategory/',
  load(params){
    return request({
      url: this.url+'searchCustomCourseCategoryPage',
      method: 'GET',
      params
    });
  },
  getSencondCate(params){
    return request({
      url: this.url+'searchListByParentId',
      method: 'GET',
      params
    });
  },
  add(data){
    return request({
      url: this.url+'createCustomCourseCategory',
      method: 'POST',
      data
    });
  },
  update(data){
    return request({
      url: this.url+'updateCustomCourseCategory/'+data.id,
      method: 'POST',
      data
    });
  },
  delete(data){
    return request({
      url: this.url+'deleteCustomCourseCategory',
      method: 'POST',
      data
    });
  },
};
const QA={
  url: '/customCourse/questionAnswer/',
  load(params){
    return request({
      url: this.url+'searchQuestionAnswerPage',
      method: 'GET',
      params
    });
  },
  getone(params){
    return request({
      url: this.url+'findQuestionAnswerById',
      method: 'GET',
      params
    });
  },
  add(data){
    return request({
      url: this.url+'createQuestionAnswer',
      method: 'POST',
      data
    });
  },
  update(data){
    return request({
      url: this.url+'updateQuestionAnswer/'+data.id,
      method: 'POST',
      data
    });
  },
  delete(data){
    return request({
      url: this.url+'deleteQuestionAnswer',
      method: 'POST',
      data
    });
  },
  activate(data){
    return request({
      url: this.url+'activate',
      method: 'POST',
      data
    });
  }
};
const QACategory={
  url: '/customCourse/qaCategory/',
  load(params){
    return request({
      url: this.url+'searchQaCategoryPage',
      method: 'GET',
      params
    });
  },
  add(data){
    return request({
      url: this.url+'createQaCategory',
      method: 'POST',
      data
    });
  },
  update(data){
    return request({
      url: this.url+'updateQaCategory/'+data.id,
      method: 'POST',
      data
    });
  },
  delete(data){
    return request({
      url: this.url+'deleteQaCategory',
      method: 'POST',
      data
    });
  },
  activate(data){
    return request({
      url: this.url+'activate',
      method: 'POST',
      data
    });
  }

}

const CourseQuestionaire={
  url:"/customCourse/questionaire/",
  load(params){
    return request({
      url:this.url+'searchQuestionairePage',
      method:"GET",
      params
    })
  },
  getone(params){
    return request({
      url:this.url+'findQuestionaireById',
      method:"GET",
      params
    })
  },
  add(data){
    return request({
      url: this.url+'createQuestionaire',
      method: 'POST',
      data
    });
  },
  update(data){
    return request({
      url: this.url+'updateQuestionaire/'+data.id,
      method: 'POST',
      data
    });
  },
  delete(data){
    return request({
      url: this.url+'deleteQuestionaire',
      method: 'POST',
      data
    });
  },
  setStatus(data){
    return request({
      url: this.url+'setStatus',
      method: 'POST',
      data
    });
  },
  record(params){
    return request({
      url:this.url+'findAnswerData',
      method:"GET",
      params
    })
  },
  exportQuestionaireData(params){
    return request({
      url:this.url+'exportQuestionaireData',
      method:"GET",
      params
    })
  },
  feedback(data){
    return request({
      url:this.url+'feedback',
      method:"POST",
      data
    })
  },
  searchFeedbackList(params){
    return request({
      url: this.url+'searchFeedbackList',
      method: 'GET',
      params
    });
  },
  deleteFeedback(data){
    return request({
      url:this.url+'deleteFeedback',
      method:"POST",
      data
    })
  },
  setTop(data){
    return request({
      url:this.url+'setTop',
      method:"POST",
      data
    })
  }
}

const training={
  url:"/customCourse/training/",
  load(params){
    return request({
      url:this.url+'searchCourseTrainingPage',
      method:"GET",
      params
    })
  },
  getone(params){
    return request({
      url:this.url+'findCourseTrainingById',
      method:"GET",
      params
    })
  },
  add(data){
    return request({
      url: this.url+'createCourseTraining',
      method: 'POST',
      data
    });
  },
  update(data){
    return request({
      url: this.url+'updateCourseTraining/'+data.id,
      method: 'POST',
      data
    });
  },
  delete(data){
    return request({
      url: this.url+'deleteCourseTraining',
      method: 'POST',
      data
    });
  },
  record(params){
    return request({
      url:this.url+'findTestAndAnswerData',
      method:"GET",
      params
    })
  },
  approveTrainingTestData(data){
    return request({
      url: this.url+'approveTrainingTestData',
      method: 'POST',
      data
    });
  },
  approveTraining(data){
    return request({
      url: this.url+'approveTraining',
      method: 'POST',
      data
    });
  },
  exportTestAndAnswerData(params){
    return request({
      url:this.url+'exportTestAndAnswerData',
      method:"GET",
      params
    })
  },
  feedback(data){
    return request({
      url:this.url+'feedback',
      method:"POST",
      data
    })
  },
  searchFeedbackList(params){
    return request({
      url: this.url+'searchFeedbackList',
      method: 'GET',
      params
    });
  },
  deleteFeedback(data){
    return request({
      url:this.url+'deleteFeedback',
      method:"POST",
      data
    })
  },
}

var teacher={
  url:'/customCourse/teacher/',
  load(params){
    return request({
      url:this.url+'searchTeacherPage',
      method:"GET",
      params
    })
  },
  getone(params){
    return request({
      url:this.url+'findCourseTeacherById',
      method:"GET",
      params
    })
  },
  add(data){
    return request({
      url: this.url+'createTeacher',
      method: 'POST',
      data
    });
  },
  update(data){
    return request({
      url: this.url+'updateTeacher/'+data.id,
      method: 'POST',
      data
    });
  },
  delete(data){
    return request({
      url: this.url+'deleteTeacher',
      method: 'POST',
      data
    });
  },
  approveTeacher(data){
    return request({
      url: this.url+'approveTeacher',
      method: 'POST',
      data
    });
  },
  record(params){
    return request({
      url: this.url+'getStudentsPage',
      method: 'GET',
      params
    });
  },
  exportTeacherStudents(params){
    return request({
      url: this.url+'exportTeacherStudents',
      method: 'GET',
      params
    });
  },
  createUpdateTeacherInstructions(data){
    return request({
      url: this.url+'createUpdateTeacherInstructions',
      method: 'POST',
      data
    });
  }
};
var teacherCategory={
  url: '/customCourse/teacherCategory/',
  load(params){
    return request({
      url: this.url+'searchTeacherCategoryPage',
      method: 'GET',
      params
    });
  },
  getSencondCate(params){
    return request({
      url: this.url+'searchListByParentId',
      method: 'GET',
      params
    });
  },
  add(data){
    return request({
      url: this.url+'createTeacherCategory',
      method: 'POST',
      data
    });
  },
  update(data){
    return request({
      url: this.url+'updateTeacherCategory/'+data.id,
      method: 'POST',
      data
    });
  },
  delete(data){
    return request({
      url: this.url+'deleteTeacherCategory',
      method: 'POST',
      data
    });
  },
};
var order={
  url: '/customCourse/order/',
  load(params){
    return request({
      url: this.url+'searchOrderPage',
      method: 'GET',
      params
    });
  },
  getone(params){
    return request({
      url:this.url+'findCustomCourseOrderById',
      method:"GET",
      params
    })
  },
  updateOrderPrice(data){
    return request({
      url:this.url+'updateOrderPrice',
      method:"POST",
      data
    })
  },
  refundCustomCourseOrder(data){
    return request({
      url:this.url+'refundCustomCourseOrder',
      method:"POST",
      data
    })
  },
  finishCustomCourseOrder(data){
    return request({
      url:this.url+'finishCustomCourseOrder',
      method:"POST",
      data
    })
  },
  searchFeedbackList(params){
    return request({
      url: this.url+'searchFeedbackList',
      method: 'GET',
      params
    });
  },
  feedback(data){
    return request({
      url:this.url+'feedback',
      method:"POST",
      data
    })
  }
};
var teacherorder={
  url: '/courseTeacher/order/',
  load(params){
    return request({
      url: this.url+'searchOrderPage',
      method: 'GET',
      params
    });
  },
  getone(params){
    return request({
      url:this.url+'findOrderById',
      method:"GET",
      params
    })
  },
  updateOrderPrice(data){
    return request({
      url:this.url+'updateOrderPrice',
      method:"POST",
      data
    })
  },
  refundOrder(data){
    return request({
      url:this.url+'refundOrder',
      method:"POST",
      data
    })
  },
  finishOrder(data){
    return request({
      url:this.url+'finishOrder',
      method:"POST",
      data
    })
  },
  searchFeedbackList(params){
    return request({
      url: this.url+'searchFeedbackList',
      method: 'GET',
      params
    });
  },
  feedback(data){
    return request({
      url:this.url+'feedback',
      method:"POST",
      data
    })
  }
};
var PageSetup={
  url: '/customCourse/pageSetup/',
  load(params){
    return request({
      url: this.url+'searchCustomCoursePageSetupPage',
      method: 'GET',
      params
    });
  },
  add(data){
    return request({
      url: this.url+'createCustomCoursePageSetup',
      method: 'POST',
      data
    });
  },
  update(data){
    return request({
      url: this.url+'updateCustomCoursePageSetup/'+data.id,
      method: 'POST',
      data
    });
  },
}
export{
  customCourseCategory,
  customCourseList,
  QA,
  QACategory,
  CourseQuestionaire,
  training,
  teacher,
  teacherCategory,
  order,
  teacherorder,
  PageSetup,
  packages
}
