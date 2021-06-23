package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.Salary;
import com.mycompany.myapp.domain.enumeration.JobLevel;
import com.mycompany.myapp.repository.SalaryRepository;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link SalaryResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class SalaryResourceIT {

    private static final JobLevel DEFAULT_JOBLEVEL = JobLevel.Tier_1;
    private static final JobLevel UPDATED_JOBLEVEL = JobLevel.Tier_2;

    private static final Long DEFAULT_SALARY = 1L;
    private static final Long UPDATED_SALARY = 2L;

    private static final String ENTITY_API_URL = "/api/salaries";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private SalaryRepository salaryRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restSalaryMockMvc;

    private Salary salary;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Salary createEntity(EntityManager em) {
        Salary salary = new Salary().joblevel(DEFAULT_JOBLEVEL).salary(DEFAULT_SALARY);
        return salary;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Salary createUpdatedEntity(EntityManager em) {
        Salary salary = new Salary().joblevel(UPDATED_JOBLEVEL).salary(UPDATED_SALARY);
        return salary;
    }

    @BeforeEach
    public void initTest() {
        salary = createEntity(em);
    }

    @Test
    @Transactional
    void createSalary() throws Exception {
        int databaseSizeBeforeCreate = salaryRepository.findAll().size();
        // Create the Salary
        restSalaryMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(salary)))
            .andExpect(status().isCreated());

        // Validate the Salary in the database
        List<Salary> salaryList = salaryRepository.findAll();
        assertThat(salaryList).hasSize(databaseSizeBeforeCreate + 1);
        Salary testSalary = salaryList.get(salaryList.size() - 1);
        assertThat(testSalary.getJoblevel()).isEqualTo(DEFAULT_JOBLEVEL);
        assertThat(testSalary.getSalary()).isEqualTo(DEFAULT_SALARY);
    }

    @Test
    @Transactional
    void createSalaryWithExistingId() throws Exception {
        // Create the Salary with an existing ID
        salary.setId(1L);

        int databaseSizeBeforeCreate = salaryRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restSalaryMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(salary)))
            .andExpect(status().isBadRequest());

        // Validate the Salary in the database
        List<Salary> salaryList = salaryRepository.findAll();
        assertThat(salaryList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkJoblevelIsRequired() throws Exception {
        int databaseSizeBeforeTest = salaryRepository.findAll().size();
        // set the field null
        salary.setJoblevel(null);

        // Create the Salary, which fails.

        restSalaryMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(salary)))
            .andExpect(status().isBadRequest());

        List<Salary> salaryList = salaryRepository.findAll();
        assertThat(salaryList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllSalaries() throws Exception {
        // Initialize the database
        salaryRepository.saveAndFlush(salary);

        // Get all the salaryList
        restSalaryMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(salary.getId().intValue())))
            .andExpect(jsonPath("$.[*].joblevel").value(hasItem(DEFAULT_JOBLEVEL.toString())))
            .andExpect(jsonPath("$.[*].salary").value(hasItem(DEFAULT_SALARY.intValue())));
    }

    @Test
    @Transactional
    void getSalary() throws Exception {
        // Initialize the database
        salaryRepository.saveAndFlush(salary);

        // Get the salary
        restSalaryMockMvc
            .perform(get(ENTITY_API_URL_ID, salary.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(salary.getId().intValue()))
            .andExpect(jsonPath("$.joblevel").value(DEFAULT_JOBLEVEL.toString()))
            .andExpect(jsonPath("$.salary").value(DEFAULT_SALARY.intValue()));
    }

    @Test
    @Transactional
    void getNonExistingSalary() throws Exception {
        // Get the salary
        restSalaryMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewSalary() throws Exception {
        // Initialize the database
        salaryRepository.saveAndFlush(salary);

        int databaseSizeBeforeUpdate = salaryRepository.findAll().size();

        // Update the salary
        Salary updatedSalary = salaryRepository.findById(salary.getId()).get();
        // Disconnect from session so that the updates on updatedSalary are not directly saved in db
        em.detach(updatedSalary);
        updatedSalary.joblevel(UPDATED_JOBLEVEL).salary(UPDATED_SALARY);

        restSalaryMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedSalary.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedSalary))
            )
            .andExpect(status().isOk());

        // Validate the Salary in the database
        List<Salary> salaryList = salaryRepository.findAll();
        assertThat(salaryList).hasSize(databaseSizeBeforeUpdate);
        Salary testSalary = salaryList.get(salaryList.size() - 1);
        assertThat(testSalary.getJoblevel()).isEqualTo(UPDATED_JOBLEVEL);
        assertThat(testSalary.getSalary()).isEqualTo(UPDATED_SALARY);
    }

    @Test
    @Transactional
    void putNonExistingSalary() throws Exception {
        int databaseSizeBeforeUpdate = salaryRepository.findAll().size();
        salary.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSalaryMockMvc
            .perform(
                put(ENTITY_API_URL_ID, salary.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(salary))
            )
            .andExpect(status().isBadRequest());

        // Validate the Salary in the database
        List<Salary> salaryList = salaryRepository.findAll();
        assertThat(salaryList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchSalary() throws Exception {
        int databaseSizeBeforeUpdate = salaryRepository.findAll().size();
        salary.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSalaryMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(salary))
            )
            .andExpect(status().isBadRequest());

        // Validate the Salary in the database
        List<Salary> salaryList = salaryRepository.findAll();
        assertThat(salaryList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamSalary() throws Exception {
        int databaseSizeBeforeUpdate = salaryRepository.findAll().size();
        salary.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSalaryMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(salary)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Salary in the database
        List<Salary> salaryList = salaryRepository.findAll();
        assertThat(salaryList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateSalaryWithPatch() throws Exception {
        // Initialize the database
        salaryRepository.saveAndFlush(salary);

        int databaseSizeBeforeUpdate = salaryRepository.findAll().size();

        // Update the salary using partial update
        Salary partialUpdatedSalary = new Salary();
        partialUpdatedSalary.setId(salary.getId());

        partialUpdatedSalary.salary(UPDATED_SALARY);

        restSalaryMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSalary.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSalary))
            )
            .andExpect(status().isOk());

        // Validate the Salary in the database
        List<Salary> salaryList = salaryRepository.findAll();
        assertThat(salaryList).hasSize(databaseSizeBeforeUpdate);
        Salary testSalary = salaryList.get(salaryList.size() - 1);
        assertThat(testSalary.getJoblevel()).isEqualTo(DEFAULT_JOBLEVEL);
        assertThat(testSalary.getSalary()).isEqualTo(UPDATED_SALARY);
    }

    @Test
    @Transactional
    void fullUpdateSalaryWithPatch() throws Exception {
        // Initialize the database
        salaryRepository.saveAndFlush(salary);

        int databaseSizeBeforeUpdate = salaryRepository.findAll().size();

        // Update the salary using partial update
        Salary partialUpdatedSalary = new Salary();
        partialUpdatedSalary.setId(salary.getId());

        partialUpdatedSalary.joblevel(UPDATED_JOBLEVEL).salary(UPDATED_SALARY);

        restSalaryMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSalary.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSalary))
            )
            .andExpect(status().isOk());

        // Validate the Salary in the database
        List<Salary> salaryList = salaryRepository.findAll();
        assertThat(salaryList).hasSize(databaseSizeBeforeUpdate);
        Salary testSalary = salaryList.get(salaryList.size() - 1);
        assertThat(testSalary.getJoblevel()).isEqualTo(UPDATED_JOBLEVEL);
        assertThat(testSalary.getSalary()).isEqualTo(UPDATED_SALARY);
    }

    @Test
    @Transactional
    void patchNonExistingSalary() throws Exception {
        int databaseSizeBeforeUpdate = salaryRepository.findAll().size();
        salary.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSalaryMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, salary.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(salary))
            )
            .andExpect(status().isBadRequest());

        // Validate the Salary in the database
        List<Salary> salaryList = salaryRepository.findAll();
        assertThat(salaryList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchSalary() throws Exception {
        int databaseSizeBeforeUpdate = salaryRepository.findAll().size();
        salary.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSalaryMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(salary))
            )
            .andExpect(status().isBadRequest());

        // Validate the Salary in the database
        List<Salary> salaryList = salaryRepository.findAll();
        assertThat(salaryList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamSalary() throws Exception {
        int databaseSizeBeforeUpdate = salaryRepository.findAll().size();
        salary.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSalaryMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(salary)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Salary in the database
        List<Salary> salaryList = salaryRepository.findAll();
        assertThat(salaryList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteSalary() throws Exception {
        // Initialize the database
        salaryRepository.saveAndFlush(salary);

        int databaseSizeBeforeDelete = salaryRepository.findAll().size();

        // Delete the salary
        restSalaryMockMvc
            .perform(delete(ENTITY_API_URL_ID, salary.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Salary> salaryList = salaryRepository.findAll();
        assertThat(salaryList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
